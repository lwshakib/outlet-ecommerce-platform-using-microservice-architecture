import React, { useState, useEffect, useRef, useMemo } from 'react';
import { render, Text, Box, useInput, useApp, Static } from 'ink';
import SelectInput from 'ink-select-input';
import Spinner from 'ink-spinner';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import yaml from 'js-yaml';
import chalk from 'chalk';

const ROOT_DIR = path.resolve(__dirname, '..');

interface ServiceConfig {
  cwd: string;
  shell: string;
  autoRestart?: boolean;
}

interface ServicesYaml {
  procs: Record<string, ServiceConfig>;
}

interface ProcessState {
  name: string;
  status: 'stopped' | 'running' | 'error';
  logs: string[];
}

const Runner = () => {
  const { exit } = useApp();
  const [selectedService, setSelectedService] = useState<string>('');
  const [processStates, setProcessStates] = useState<Record<string, ProcessState>>({});
  const [services, setServices] = useState<Record<string, ServiceConfig>>({});
  const logsEndRef = useRef<Record<string, string[]>>({});

  useEffect(() => {
    const fileContents = fs.readFileSync(path.join(ROOT_DIR, 'services.yaml'), 'utf8');
    const config = yaml.load(fileContents) as ServicesYaml;
    const initialProcs: Record<string, ProcessState> = {};
    
    setServices(config.procs);
    const serviceNames = Object.keys(config.procs);
    if (serviceNames.length > 0) setSelectedService(serviceNames[0]!);

    serviceNames.forEach((name) => {
      initialProcs[name] = { name, status: 'stopped', logs: [`Starting ${name}...`] };
      startProcess(name, config.procs[name]!);
    });

    setProcessStates(initialProcs);

    return () => {
        // Cleanup all processes on exit
    };
  }, []);

  const startProcess = (name: string, config: ServiceConfig) => {
    const fullCwd = path.join(ROOT_DIR, config.cwd);

    const child = spawn(config.shell, {
      cwd: fullCwd,
      env: { ...process.env, FORCE_COLOR: 'true' },
      shell: true
    });

    setProcessStates(prev => {
      const currentState = prev[name];
      if (!currentState) return prev;
      return {
        ...prev,
        [name]: { ...currentState, status: 'running' }
      };
    });

    const handleData = (data: Buffer) => {
      const line = data.toString();
      setProcessStates(prev => {
        const currentState = prev[name];
        if (!currentState) return prev;
        const newLogs = [...currentState.logs, line].slice(-500);
        return {
          ...prev,
          [name]: { ...currentState, logs: newLogs }
        };
      });
    };

    child.stdout.on('data', handleData);
    child.stderr.on('data', handleData);

    child.on('close', (code) => {
      setProcessStates(prev => {
        const currentState = prev[name];
        if (!currentState) return prev;
        return {
          ...prev,
          [name]: { 
            ...currentState, 
            status: code === 0 ? 'stopped' : 'error', 
            logs: [...currentState.logs, `Process exited with code ${code}`] 
          }
        };
      });
      
      if (config.autoRestart) {
        setTimeout(() => startProcess(name, config), 2000);
      }
    });

    child.on('error', (err) => {
        setProcessStates(prev => {
          const currentState = prev[name];
          if (!currentState) return prev;
          return {
            ...prev,
            [name]: { 
              ...currentState, 
              status: 'error', 
              logs: [...currentState.logs, `Failed to start: ${err.message}`] 
            }
          };
        });
    });
  };

  useInput((input, key) => {
    if (input === 'q') exit();
    if (key.upArrow) {
        const names = Object.keys(services);
        const idx = names.indexOf(selectedService);
        const prevName = names[idx - 1];
        if (prevName) setSelectedService(prevName);
    }
    if (key.downArrow) {
        const names = Object.keys(services);
        const idx = names.indexOf(selectedService);
        const nextName = names[idx + 1];
        if (nextName) setSelectedService(nextName);
    }
    if (input === 'r' && selectedService) {
        // Restart logic could go here
    }
  });

  const menuItems = useMemo(() => {
    return Object.keys(services).map(name => {
      const state = processStates[name];
      let statusColor = 'gray';
      if (state?.status === 'running') statusColor = 'green';
      if (state?.status === 'error') statusColor = 'red';
      
      return {
        label: name,
        value: name,
        color: statusColor
      };
    });
  }, [services, processStates]);

  const currentLogs = processStates[selectedService]?.logs || [];

  return (
    <Box flexDirection="column" height="100%">
      <Box borderStyle="round" borderColor="cyan" paddingX={1} marginBottom={1}>
        <Text bold color="cyan">Antigravity Runner v1.0</Text>
        <Text color="gray"> | </Text>
        <Text color="white">Keys: </Text>
        <Text color="yellow">↑↓ </Text><Text color="white">Navigate | </Text>
        <Text color="yellow">q </Text><Text color="white">Quit</Text>
      </Box>

      <Box flexDirection="row" flexGrow={1}>
        {/* Sidebar */}
        <Box flexDirection="column" width={30} borderStyle="single" borderColor="gray" paddingX={1}>
          <Text bold underline>Services</Text>
          {menuItems.map(item => (
            <Box key={item.value}>
                <Text color={item.value === selectedService ? 'cyan' : 'white'}>
                    {item.value === selectedService ? '> ' : '  '}
                    <Text color={item.color}>● </Text>
                    {item.label}
                </Text>
            </Box>
          ))}
        </Box>

        {/* Main Log View */}
        <Box flexDirection="column" flexGrow={1} borderStyle="single" borderColor="gray" paddingX={1}>
          <Box justifyContent="space-between" marginBottom={1}>
            <Text bold color="yellow">Output: {selectedService}</Text>
            <Text color="gray">Showing last 500 lines</Text>
          </Box>
          <Box flexDirection="column" flexGrow={1}>
            {currentLogs.slice(-20).map((log, i) => (
                <Text key={i} color="white" wrap="truncate-end">{log.replace(/\n$/, '')}</Text>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

render(<Runner />);
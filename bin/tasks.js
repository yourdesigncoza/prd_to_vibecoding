#!/usr/bin/env node
import { createCLI } from '../dist/tasks_cli.js';

// Create and parse CLI
const program = createCLI();
program.parse(process.argv);

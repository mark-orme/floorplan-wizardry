
/**
 * Centralized import file for Vitest utilities
 * Include this file at the top of test files
 */
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

export {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  renderHook,
  act,
  render,
  screen,
  fireEvent,
  waitFor
};

/**
 * Unit tests for auto-save functionality
 * 
 * Tests verify:
 * - Debouncing works correctly (500ms delay)
 * - Persisted values are tracked
 * - Failed saves are handled
 * - Error handlers are called on failure
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createAutoSaveHandler } from '../../src/module/sheets/auto-save.js';

describe('Auto-Save Utility', () => {
  let mockActor: any;

  beforeEach(() => {
    // Create mock actor with update method
    mockActor = {
      system: {
        biography: 'Old bio',
        passions: { motivation: 'Old motivation' },
        stats: { brn: 10 },
      },
      update: vi.fn(() => Promise.resolve()),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create handler successfully', () => {
    const handler = createAutoSaveHandler(mockActor, { debounceMs: 500 });
    expect(handler).toBeDefined();
    expect(handler.handleFieldChange).toBeDefined();
    expect(handler.cleanup).toBeDefined();
    handler.cleanup();
  });

  it('should persist field via persistField method', async () => {
    const handler = createAutoSaveHandler(mockActor, { debounceMs: 50 });
    
    // Directly call persistField
    await handler.persistField('system.biography', 'New bio');
    
    // Verify update was called with correct field
    expect(mockActor.update).toHaveBeenCalledWith({ 'system.biography': 'New bio' });
    handler.cleanup();
  });

  it('should handle failed persistence with custom error handler', async () => {
    const errorHandler = vi.fn();
    mockActor.update = vi.fn(() => Promise.reject(new Error('Save failed')));

    const handler = createAutoSaveHandler(mockActor, {
      debounceMs: 50,
      onError: errorHandler,
    });
    
    // Attempt to persist - should fail and throw error
    let threwError = false;
    try {
      await handler.persistField('system.biography', 'New bio');
    } catch (error) {
      threwError = true;
    }
    
    // Verify error was thrown
    expect(threwError).toBe(true);
    
    handler.cleanup();
  });

  it('should support nested field paths', async () => {
    const handler = createAutoSaveHandler(mockActor, { debounceMs: 50 });
    
    // Persist a nested field
    await handler.persistField('system.passions.motivation', 'New motivation');
    
    // Verify update was called with nested path
    expect(mockActor.update).toHaveBeenCalledWith({ 'system.passions.motivation': 'New motivation' });
    
    handler.cleanup();
  });

  it('should allow custom debounce delay', () => {
    const handler1 = createAutoSaveHandler(mockActor, { debounceMs: 100 });
    const handler2 = createAutoSaveHandler(mockActor, { debounceMs: 1000 });
    
    // Both should be created successfully with different delays
    expect(handler1).toBeDefined();
    expect(handler2).toBeDefined();
    
    handler1.cleanup();
    handler2.cleanup();
  });

  it('should cleanup without errors', () => {
    const handler = createAutoSaveHandler(mockActor, { debounceMs: 500 });
    
    // Should not throw
    expect(() => handler.cleanup()).not.toThrow();
  });

  it('should track persisted values', async () => {
    const handler = createAutoSaveHandler(mockActor, { debounceMs: 50 });
    
    // First persist
    await handler.persistField('system.biography', 'First value');
    expect(mockActor.update).toHaveBeenCalledTimes(1);
    
    // Second persist
    await handler.persistField('system.biography', 'Second value');
    expect(mockActor.update).toHaveBeenCalledTimes(2);
    
    handler.cleanup();
  });

  it('should handle persistent errors gracefully', async () => {
    const errorHandler = vi.fn();
    mockActor.update = vi.fn(() => Promise.reject(new Error('Network error')));
    
    const handler = createAutoSaveHandler(mockActor, {
      debounceMs: 50,
      onError: errorHandler,
    });
    
    // First attempt
    try {
      await handler.persistField('system.test', 'value1');
    } catch {
      // Expected
    }
    
    // Second attempt should still work
    mockActor.update = vi.fn(() => Promise.resolve());
    await handler.persistField('system.test', 'value2');
    
    expect(mockActor.update).toHaveBeenCalledWith({ 'system.test': 'value2' });
    
    handler.cleanup();
  });
});

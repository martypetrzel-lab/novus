import { describe, expect, it } from 'vitest';
import { DEFAULT_LOCALE, translateLegacyText } from '@novus/shared';
import { ActionValidator, createWorld, findPath, Simulation } from './index';

describe('NOVUS simulation', () => {
  it('generates a deterministic 100x100 empty world', () => {
    const a = createWorld(42, 10), b = createWorld(42, 10);
    expect(a.tiles).toHaveLength(10000);
    expect(a.tiles[4040].type).toBe(b.tiles[4040].type);
    expect(a.structures).toHaveLength(0);
    expect(a.agents).toHaveLength(10);
  });
  it('uses Czech as the default player language', () => {
    const state = createWorld(42, 1);
    expect(state.locale).toBe(DEFAULT_LOCALE);
    expect(state.name).toBe('První svět');
    expect(state.agents[0].intention).toContain('okolí');
    expect(state.events[0].text).toContain('obyvatel');
  });
  it('localizes Phase 1 saved text without discarding the world', () => {
    expect(translateLegacyText('Mira moved through grass.')).toBe('Mira prochází terénem: tráva.');
    expect(translateLegacyText('Taking in the unfamiliar landscape')).toBe('Rozhlíží se po neznámé krajině');
  });
  it('advances independently of rendering', () => {
    const sim = new Simulation(createWorld(5, 3)); sim.tick();
    expect(sim.state.tick).toBe(1); expect(sim.state.events.length).toBeGreaterThan(0);
  });
  it('finds walkable paths', () => {
    const state = createWorld(8, 1), agent = state.agents[0];
    expect(findPath(state, agent, { x: agent.x + 5, y: agent.y + 5 }).length).toBeGreaterThan(0);
  });
  it('rejects actions outside the world', () => {
    const state = createWorld(9, 1);
    expect(new ActionValidator().validate(state, state.agents[0], { type: 'MOVE', target: { x: -4, y: 1 } }).valid).toBe(false);
  });
  it('detects repetition', async () => {
    const { PatternDetector } = await import('@novus/learning-engine');
    const agent = createWorld(1, 1).agents[0];
    agent.actionHistory = Array.from({ length: 8 }, () => ({ type: 'WAIT' as const }));
    expect(new PatternDetector().detect(agent).repetitive).toBe(true);
  });
});

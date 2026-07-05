import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de Next.js Router para que no falle cuando los componentes usan useRouter()
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      prefetch: () => null,
      push: vi.fn(),
    };
  },
}));
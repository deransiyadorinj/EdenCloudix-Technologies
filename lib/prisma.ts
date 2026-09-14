import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import fs from 'fs';
import path from 'path';

function getEffectiveConnectionString(): string {
  const rawUrl = process.env.DATABASE_URL || '';
  if (rawUrl.startsWith('prisma+postgres://')) {
    try {
      const parsed = new URL(rawUrl);
      const apiKey = parsed.searchParams.get('api_key');
      if (apiKey) {
        const decoded = JSON.parse(Buffer.from(apiKey, 'base64').toString('utf8'));
        if (decoded.databaseUrl) {
          return decoded.databaseUrl;
        }
      }
    } catch {
      // Fallback
    }
  }
  return rawUrl;
}

const connectionString = getEffectiveConnectionString();
const adapter = new PrismaPg({ connectionString });

const globalForPrisma = globalThis as unknown as {
  rawPrisma: PrismaClient | undefined;
  prisma: any | undefined;
};

const rawPrisma =
  globalForPrisma.rawPrisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.rawPrisma = rawPrisma;

// Persistent Local Store for Resilient Local Development & Testing
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'bookings.json');

function ensureDataFile(): any[] {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initial = [
      {
        id: 'init-demo-1',
        requestId: 'ECX-AI-2026-0001',
        domain: 'AI',
        name: 'Alexander Wright',
        email: 'a.wright@novatech-solutions.io',
        phone: '+1 (415) 890-1200',
        company: 'NovaTech Solutions',
        projectTitle: 'Enterprise LLM Multi-Agent Orchestrator',
        projectDescription: 'Autonomous customer interaction and predictive workflow automation platform powered by tailored domain fine-tuned models.',
        budget: '$50,000 - $100,000',
        timeline: '2 - 3 Months',
        status: 'NEW',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: 'init-demo-2',
        requestId: 'ECX-FS-2026-0002',
        domain: 'FULL_STACK',
        name: 'Elena Rostova',
        email: 'elena@quantumfleet.com',
        phone: '+44 20 7946 0912',
        company: 'QuantumFleet Global',
        projectTitle: 'Real-time Global Telematics & Dispatch Platform',
        projectDescription: 'Scalable Next.js 16 and real-time WebSocket dashboard for 10,000+ connected IoT transport units across Europe.',
        budget: '$30,000 - $60,000',
        timeline: '1 - 2 Months',
        status: 'IN_PROGRESS',
        createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'init-demo-3',
        requestId: 'ECX-CLD-2026-0003',
        domain: 'CLOUD',
        name: 'David Chen',
        email: 'd.chen@apexfintech.sg',
        phone: '+65 6789 0123',
        company: 'Apex Financial Services',
        projectTitle: 'Multi-Region Kubernetes & Disaster Recovery Architecture',
        projectDescription: 'Zero-downtime banking cloud migration on AWS with Terraform IaC, automated multi-region replication, and compliance pipelines.',
        budget: '$80,000+',
        timeline: '3 - 6 Months',
        status: 'CONTACTED',
        createdAt: new Date(Date.now() - 3600000 * 40).toISOString(),
        updatedAt: new Date(Date.now() - 3600000 * 10).toISOString(),
      },
    ];
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2), 'utf8');
    return initial;
  }
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveData(data: any[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

const fallbackBookingRequest = {
  count: async (args?: any) => {
    const list = ensureDataFile();
    if (!args?.where) return list.length;
    return list.filter((b: any) => {
      if (args.where.status && b.status !== args.where.status) return false;
      if (args.where.domain && b.domain !== args.where.domain) return false;
      return true;
    }).length;
  },

  create: async (args: any) => {
    const list = ensureDataFile();
    const item = {
      id: 'ecx_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      requestId: args.data.requestId,
      domain: args.data.domain,
      name: args.data.name,
      email: args.data.email,
      phone: args.data.phone || null,
      company: args.data.company || null,
      projectTitle: args.data.projectTitle || null,
      projectDescription: args.data.projectDescription,
      budget: args.data.budget || null,
      timeline: args.data.timeline || null,
      status: args.data.status || 'NEW',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    list.unshift(item);
    saveData(list);
    return item;
  },

  findMany: async (args?: any) => {
    let list = ensureDataFile();
    if (args?.where) {
      const w = args.where;
      list = list.filter((b: any) => {
        if (w.domain && b.domain !== w.domain) return false;
        if (w.status && b.status !== w.status) return false;
        if (w.OR && Array.isArray(w.OR)) {
          const matched = w.OR.some((cond: any) => {
            if (cond.name?.contains && !b.name?.toLowerCase().includes(cond.name.contains.toLowerCase())) return false;
            if (cond.email?.contains && !b.email?.toLowerCase().includes(cond.email.contains.toLowerCase())) return false;
            if (cond.requestId?.contains && !b.requestId?.toLowerCase().includes(cond.requestId.contains.toLowerCase())) return false;
            if (cond.projectTitle?.contains && !b.projectTitle?.toLowerCase().includes(cond.projectTitle.contains.toLowerCase())) return false;
            return true;
          });
          if (!matched) return false;
        }
        return true;
      });
    }
    const skip = args?.skip || 0;
    const take = args?.take !== undefined ? args.take : list.length;
    return list.slice(skip, skip + take).map((b: any) => ({ ...b, notifications: [] }));
  },

  findUnique: async (args: any) => {
    const list = ensureDataFile();
    const item = list.find(
      (b: any) =>
        (args?.where?.id && b.id === args.where.id) ||
        (args?.where?.requestId && b.requestId === args.where.requestId)
    );
    if (!item) return null;
    return { ...item, notifications: [] };
  },

  update: async (args: any) => {
    const list = ensureDataFile();
    const idx = list.findIndex((b: any) => b.id === args?.where?.id);
    if (idx === -1) throw new Error('Not found');
    list[idx] = { ...list[idx], ...args.data, updatedAt: new Date().toISOString() };
    saveData(list);
    return { ...list[idx], notifications: [] };
  },

  delete: async (args: any) => {
    let list = ensureDataFile();
    const item = list.find((b: any) => b.id === args?.where?.id);
    if (!item) throw new Error('Not found');
    list = list.filter((b: any) => b.id !== args?.where?.id);
    saveData(list);
    return item;
  },
};

const bookingRequestProxy = new Proxy(rawPrisma.bookingRequest, {
  get(target, prop, receiver) {
    const origMethod = Reflect.get(target, prop, receiver);
    if (typeof origMethod === 'function') {
      return async (...methodArgs: any[]) => {
        try {
          return await origMethod.apply(target, methodArgs);
        } catch (err: any) {
          console.warn(`[Database] PostgreSQL fallback active (${err?.code || 'offline'}), using persistent store.`);
          const fallbackFn = (fallbackBookingRequest as any)[prop];
          if (typeof fallbackFn === 'function') {
            return await fallbackFn.apply(fallbackBookingRequest, methodArgs);
          }
          throw err;
        }
      };
    }
    return origMethod;
  },
});

export const prisma = new Proxy(rawPrisma as any, {
  get(target, prop, receiver) {
    if (prop === 'bookingRequest') {
      return bookingRequestProxy;
    }
    return Reflect.get(target, prop, receiver);
  },
});

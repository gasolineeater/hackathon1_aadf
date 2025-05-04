// Mock API for demo purposes
import { User } from '@supabase/supabase-js';

// Mock user data
const mockUsers = [
  {
    id: '1',
    email: 'admin@aadf.org',
    password: 'admin123',
    role: 'admin',
    full_name: 'AADF Admin',
    organization: 'AADF'
  },
  {
    id: '2',
    email: 'evaluator@aadf.org',
    password: 'evaluator123',
    role: 'evaluator',
    full_name: 'AADF Evaluator',
    organization: 'AADF'
  },
  {
    id: '3',
    email: 'vendor@example.com',
    password: 'vendor123',
    role: 'vendor',
    full_name: 'Vendor User',
    organization: 'Example Vendor'
  }
];

// Mock session data
let currentSession: any = null;
let currentUser: any = null;

// Mock authentication functions
export const mockAuth = {
  signInWithPassword: async ({ email, password }: { email: string; password: string }) => {
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { error: { message: 'Invalid login credentials' }, data: { user: null, session: null } };
    }
    
    // Create mock session
    const session = {
      access_token: 'mock-token-' + Math.random().toString(36).substring(2),
      refresh_token: 'mock-refresh-' + Math.random().toString(36).substring(2),
      expires_at: Date.now() + 3600 * 1000,
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          full_name: user.full_name,
          organization: user.organization,
          role: user.role
        }
      }
    };
    
    currentSession = session;
    currentUser = session.user;
    
    return { error: null, data: { user: session.user, session } };
  },
  
  signUp: async ({ email, password, options }: { email: string; password: string; options?: any }) => {
    // Check if user already exists
    if (mockUsers.some(u => u.email === email)) {
      return { error: { message: 'User already exists' }, data: { user: null, session: null } };
    }
    
    // Create new user
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email,
      password,
      role: options?.data?.role || 'vendor',
      full_name: options?.data?.full_name || '',
      organization: options?.data?.organization || ''
    };
    
    mockUsers.push(newUser);
    
    // Create mock session
    const session = {
      access_token: 'mock-token-' + Math.random().toString(36).substring(2),
      refresh_token: 'mock-refresh-' + Math.random().toString(36).substring(2),
      expires_at: Date.now() + 3600 * 1000,
      user: {
        id: newUser.id,
        email: newUser.email,
        user_metadata: {
          full_name: newUser.full_name,
          organization: newUser.organization,
          role: newUser.role
        }
      }
    };
    
    currentSession = session;
    currentUser = session.user;
    
    return { error: null, data: { user: session.user, session } };
  },
  
  signOut: async () => {
    currentSession = null;
    currentUser = null;
    return { error: null };
  },
  
  getSession: async () => {
    return { data: { session: currentSession }, error: null };
  },
  
  getUser: async () => {
    return { data: { user: currentUser }, error: null };
  },
  
  onAuthStateChange: (callback: any) => {
    // Mock subscription
    const subscription = {
      unsubscribe: () => {}
    };
    
    // Call callback with current session
    callback('SIGNED_IN', currentSession);
    
    return { data: { subscription } };
  },
  
  resetPasswordForEmail: async (email: string) => {
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return { error: { message: 'User not found' } };
    }
    
    return { error: null };
  },
  
  updateUser: async (updates: any) => {
    if (!currentUser) {
      return { error: { message: 'No user logged in' } };
    }
    
    // Update user metadata
    const userIndex = mockUsers.findIndex(u => u.id === currentUser.id);
    
    if (userIndex >= 0) {
      mockUsers[userIndex] = {
        ...mockUsers[userIndex],
        ...updates.data
      };
      
      currentUser = {
        ...currentUser,
        user_metadata: {
          ...currentUser.user_metadata,
          ...updates.data
        }
      };
    }
    
    return { error: null, data: { user: currentUser } };
  }
};

// Mock database functions
export const mockDatabase = {
  // Tenders
  tenders: () => ({
    select: () => ({
      order: () => ({
        data: [],
        error: null
      }),
      eq: () => ({
        single: () => ({
          data: null,
          error: null
        })
      })
    }),
    insert: () => ({
      select: () => ({
        data: [{ id: '1', title: 'Mock Tender' }],
        error: null
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          data: [{ id: '1', title: 'Updated Mock Tender' }],
          error: null
        })
      })
    })
  }),
  
  // Profiles
  profiles: () => ({
    select: () => ({
      eq: () => ({
        single: () => ({
          data: { id: currentUser?.id, role: currentUser?.user_metadata?.role || 'vendor' },
          error: null
        })
      })
    }),
    insert: () => ({
      data: [{ id: '1' }],
      error: null
    }),
    update: () => ({
      eq: () => ({
        data: [{ id: '1' }],
        error: null
      })
    })
  }),
  
  // Other tables with similar patterns
  vendors: () => ({
    select: () => ({
      order: () => ({
        data: [],
        error: null
      }),
      eq: () => ({
        single: () => ({
          data: null,
          error: null
        })
      })
    }),
    insert: () => ({
      data: [{ id: '1' }],
      error: null
    })
  }),
  
  proposals: () => ({
    select: () => ({
      order: () => ({
        data: [],
        error: null
      }),
      eq: () => ({
        single: () => ({
          data: null,
          error: null
        })
      })
    }),
    insert: () => ({
      select: () => ({
        data: [{ id: '1' }],
        error: null
      })
    })
  }),
  
  documents: () => ({
    select: () => ({
      order: () => ({
        data: [],
        error: null
      }),
      eq: () => ({
        single: () => ({
          data: null,
          error: null
        })
      })
    }),
    insert: () => ({
      select: () => ({
        data: [{ id: '1' }],
        error: null
      })
    })
  }),
  
  document_validations: () => ({
    select: () => ({
      order: () => ({
        data: [],
        error: null
      }),
      eq: () => ({
        single: () => ({
          data: null,
          error: null
        })
      })
    }),
    insert: () => ({
      select: () => ({
        data: [{ id: '1' }],
        error: null
      })
    })
  }),
  
  compatibility_scores: () => ({
    select: () => ({
      order: () => ({
        data: [],
        error: null
      }),
      eq: () => ({
        single: () => ({
          data: null,
          error: null
        })
      }),
      in: () => ({
        data: [],
        error: null
      })
    }),
    insert: () => ({
      select: () => ({
        data: [{ id: '1' }],
        error: null
      })
    }),
    update: () => ({
      eq: () => ({
        select: () => ({
          data: [{ id: '1' }],
          error: null
        })
      })
    }),
    upsert: () => ({
      select: () => ({
        single: () => ({
          data: { id: '1' },
          error: null
        })
      })
    })
  }),
  
  audit_logs: () => ({
    insert: () => ({
      data: [{ id: '1' }],
      error: null
    })
  }),
  
  users: () => ({
    select: () => ({
      eq: () => ({
        single: () => ({
          data: { id: currentUser?.id, role: currentUser?.user_metadata?.role || 'vendor' },
          error: null
        })
      })
    }),
    insert: () => ({
      data: [{ id: '1' }],
      error: null
    }),
    update: () => ({
      eq: () => ({
        data: [{ id: '1' }],
        error: null
      })
    })
  }),
  
  proposal_analyses: () => ({
    select: () => ({
      order: () => ({
        data: [],
        error: null
      }),
      eq: () => ({
        single: () => ({
          data: null,
          error: null
        })
      })
    }),
    insert: () => ({
      select: () => ({
        single: () => ({
          data: { id: '1' },
          error: null
        })
      })
    })
  })
};

// Mock storage
export const mockStorage = {
  from: () => ({
    download: () => ({
      data: new Blob(['Mock file content']),
      error: null
    }),
    upload: () => ({
      data: { path: 'mock-path' },
      error: null
    }),
    getPublicUrl: () => ({
      data: { publicUrl: 'https://example.com/mock-file' },
      error: null
    })
  })
};

// Create mock Supabase client
export const createMockSupabaseClient = () => {
  return {
    auth: mockAuth,
    from: (table: string) => mockDatabase[table as keyof typeof mockDatabase](),
    storage: mockStorage
  };
};

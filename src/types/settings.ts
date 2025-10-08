export interface UserSettings {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    oab: string;
    oabState: string;
    specialization: string[];
    avatar?: string;
    bio?: string;
  };

  account: {
    language: 'pt-BR' | 'en-US' | 'es-ES';
    timezone: string;
    dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
    timeFormat: '24h' | '12h';
    currency: 'BRL' | 'USD' | 'EUR';
  };

  notifications: {
    email: {
      processUpdates: boolean;
      deadlineAlerts: boolean;
      analysisReady: boolean;
      weeklyDigest: boolean;
      marketingEmails: boolean;
    };
    push: {
      processUpdates: boolean;
      deadlineAlerts: boolean;
      analysisReady: boolean;
      urgentAlerts: boolean;
    };
    inApp: {
      processUpdates: boolean;
      deadlineAlerts: boolean;
      analysisReady: boolean;
      mentions: boolean;
    };
    preferences: {
      frequency: 'realtime' | 'hourly' | 'daily' | 'weekly';
      quietHours: {
        enabled: boolean;
        start: string;
        end: string;
      };
    };
  };

  security: {
    twoFactorEnabled: boolean;
    sessionTimeout: number;
    loginNotifications: boolean;
    trustedDevices: TrustedDevice[];
    apiKeys: ApiKey[];
    activityLog: boolean;
  };

  appearance: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    fontSize: 'small' | 'medium' | 'large';
    compactMode: boolean;
    sidebarCollapsed: boolean;
  };

  integrations: {
    openai: {
      enabled: boolean;
      apiKey?: string;
    };
    pje: {
      enabled: boolean;
      credentials?: {
        username: string;
        certificate: string;
      };
    };
    esaj: {
      enabled: boolean;
      credentials?: {
        username: string;
      };
    };
  };
}

export interface TrustedDevice {
  id: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet';
  lastAccess: Date;
  location: string;
  ipAddress: string;
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: Date;
  lastUsed?: Date;
  permissions: string[];
}

export const defaultSettings: UserSettings = {
  profile: {
    firstName: 'Usuário',
    lastName: 'Demonstração',
    email: 'usuario@exemplo.com',
    phone: '',
    oab: '',
    oabState: '',
    specialization: [],
    avatar: '',
    bio: ''
  },
  account: {
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    currency: 'BRL'
  },
  notifications: {
    email: {
      processUpdates: true,
      deadlineAlerts: true,
      analysisReady: true,
      weeklyDigest: true,
      marketingEmails: false
    },
    push: {
      processUpdates: true,
      deadlineAlerts: true,
      analysisReady: true,
      urgentAlerts: true
    },
    inApp: {
      processUpdates: true,
      deadlineAlerts: true,
      analysisReady: true,
      mentions: true
    },
    preferences: {
      frequency: 'realtime',
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    }
  },
  security: {
    twoFactorEnabled: false,
    sessionTimeout: 60,
    loginNotifications: true,
    trustedDevices: [],
    apiKeys: [],
    activityLog: true
  },
  appearance: {
    theme: 'system',
    accentColor: 'blue',
    fontSize: 'medium',
    compactMode: false,
    sidebarCollapsed: false
  },
  integrations: {
    openai: {
      enabled: false,
      apiKey: ''
    },
    pje: {
      enabled: false
    },
    esaj: {
      enabled: false
    }
  }
};

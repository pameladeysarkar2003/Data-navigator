export interface GraphNode {
  id: string;
  label: string;
  category: 'technology' | 'language' | 'framework' | 'concept';
  description: string;
  color: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphLink {
  source: string;
  target: string;
  relationship: string;
  strength: number;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export const initialGraphData: GraphData = {
  nodes: [
    {
      id: 'react',
      label: 'React',
      category: 'framework',
      description: 'A JavaScript library for building user interfaces, particularly single-page applications where data changes over time.',
      color: '#61DAFB'
    },
    {
      id: 'typescript',
      label: 'TypeScript',
      category: 'language',
      description: 'A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
      color: '#3178C6'
    },
    {
      id: 'javascript',
      label: 'JavaScript',
      category: 'language',
      description: 'A programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.',
      color: '#F7DF1E'
    },
    {
      id: 'nodejs',
      label: 'Node.js',
      category: 'technology',
      description: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine for building scalable network applications.',
      color: '#339933'
    },
    {
      id: 'vite',
      label: 'Vite',
      category: 'technology',
      description: 'A build tool that aims to provide a faster and leaner development experience for modern web projects.',
      color: '#646CFF'
    },
    {
      id: 'd3',
      label: 'D3.js',
      category: 'framework',
      description: 'A JavaScript library for manipulating documents based on data using HTML, SVG, and CSS.',
      color: '#F68E56'
    },
    {
      id: 'tailwind',
      label: 'Tailwind CSS',
      category: 'framework',
      description: 'A utility-first CSS framework packed with classes to build any design, directly in your markup.',
      color: '#06B6D4'
    },
    {
      id: 'components',
      label: 'Components',
      category: 'concept',
      description: 'Reusable pieces of code that define how a certain part of your UI should appear and behave.',
      color: '#8B5CF6'
    }
  ],
  links: [
    {
      source: 'react',
      target: 'javascript',
      relationship: 'built with',
      strength: 1
    },
    {
      source: 'typescript',
      target: 'javascript',
      relationship: 'superset of',
      strength: 1
    },
    {
      source: 'react',
      target: 'typescript',
      relationship: 'supports',
      strength: 0.8
    },
    {
      source: 'nodejs',
      target: 'javascript',
      relationship: 'runtime for',
      strength: 1
    },
    {
      source: 'vite',
      target: 'react',
      relationship: 'builds',
      strength: 0.9
    },
    {
      source: 'd3',
      target: 'javascript',
      relationship: 'built with',
      strength: 1
    },
    {
      source: 'react',
      target: 'components',
      relationship: 'uses',
      strength: 1
    },
    {
      source: 'tailwind',
      target: 'components',
      relationship: 'styles',
      strength: 0.7
    }
  ]
};

export const expandedNodes: Record<string, GraphNode[]> = {
  react: [
    {
      id: 'jsx',
      label: 'JSX',
      category: 'language',
      description: 'A syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.',
      color: '#61DAFB'
    },
    {
      id: 'hooks',
      label: 'React Hooks',
      category: 'concept',
      description: 'Functions that let you use state and other React features without writing a class.',
      color: '#61DAFB'
    }
  ],
  javascript: [
    {
      id: 'es6',
      label: 'ES6+',
      category: 'language',
      description: 'Modern JavaScript features including arrow functions, destructuring, and modules.',
      color: '#F7DF1E'
    },
    {
      id: 'dom',
      label: 'DOM',
      category: 'concept',
      description: 'Document Object Model - a programming interface for web documents.',
      color: '#E34F26'
    }
  ],
  d3: [
    {
      id: 'svg',
      label: 'SVG',
      category: 'technology',
      description: 'Scalable Vector Graphics - a web standard for vector graphics.',
      color: '#FFB13B'
    },
    {
      id: 'data-viz',
      label: 'Data Visualization',
      category: 'concept',
      description: 'The graphical representation of information and data.',
      color: '#FF6B6B'
    }
  ]
};

export const expandedLinks: Record<string, GraphLink[]> = {
  react: [
    {
      source: 'react',
      target: 'jsx',
      relationship: 'uses',
      strength: 1
    },
    {
      source: 'react',
      target: 'hooks',
      relationship: 'provides',
      strength: 1
    }
  ],
  javascript: [
    {
      source: 'javascript',
      target: 'es6',
      relationship: 'evolved to',
      strength: 1
    },
    {
      source: 'javascript',
      target: 'dom',
      relationship: 'manipulates',
      strength: 1
    }
  ],
  d3: [
    {
      source: 'd3',
      target: 'svg',
      relationship: 'generates',
      strength: 1
    },
    {
      source: 'd3',
      target: 'data-viz',
      relationship: 'enables',
      strength: 1
    }
  ]
};
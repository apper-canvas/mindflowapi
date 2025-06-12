import HomePage from '@/components/pages/HomePage';
import SessionsPage from '@/components/pages/SessionsPage';
import JournalPage from '@/components/pages/JournalPage';
import ProgressPage from '@/components/pages/ProgressPage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: 'Home',
component: HomePage
  },
  sessions: {
    id: 'sessions',
    label: 'Sessions',
    path: '/sessions',
    icon: 'Play',
component: SessionsPage
  },
  journal: {
    id: 'journal',
    label: 'Journal',
    path: '/journal',
    icon: 'BookOpen',
component: JournalPage
  },
  progress: {
    id: 'progress',
    label: 'Progress',
    path: '/progress',
    icon: 'TrendingUp',
component: ProgressPage
  }
};

export const routeArray = Object.values(routes);
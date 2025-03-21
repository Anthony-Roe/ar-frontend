'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { Container, Group, Loader } from '@mantine/core';
import HomeView from '../views/HomeView';
import LoginView from '../views/LoginView';
import CreateAccountView from '../views/CreateAccountView';
import ManagePlantsView from '../views/ManagePlantsView';
import WorkOrdersView from '../views/WorkOrdersView';

export default function Main() {
  const [currentView, setCurrentView] = useState<'home' | 'login' | 'createAccount' | 'managePlants' | 'workOrders'>('home');
  const [loading, setLoading] = useState(false);

  // Restore currentView from cookies on load
  useEffect(() => {
    const savedView = Cookies.get('currentView');
    if (savedView) {
      setCurrentView(savedView as 'home' | 'login' | 'createAccount' | 'managePlants' | 'workOrders');
    }
  }, []);

  // Save currentView to cookies whenever it changes
  useEffect(() => {
    Cookies.set('currentView', currentView, { expires: 7 }); // Expires in 7 days
  }, [currentView]);

  const renderView = () => {
    if (loading) {
      return (
        <Group position="center" mt="xl">
          <Loader size="lg" />
        </Group>
      );
    }

    switch (currentView) {
      case 'home':
        return <HomeView setCurrentView={setCurrentView} />;
      case 'login':
        return <LoginView setCurrentView={setCurrentView} setLoading={setLoading} />;
      case 'createAccount':
        return <CreateAccountView setCurrentView={setCurrentView} setLoading={setLoading} />;
      case 'managePlants':
        return <ManagePlantsView setCurrentView={setCurrentView} />;
      case 'workOrders':
        return <WorkOrdersView setCurrentView={setCurrentView} />;
      default:
        return null;
    }
  };

  return <Container size="lg" py="xl">{renderView()}</Container>;
}
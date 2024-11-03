import { useQuery } from '@tanstack/react-query';
import MonitorApi from '~/api/Collections/MonitorApi';

export const useStatusByZone = (zone) => {
  return useQuery({
    queryKey: ['statusByZone', zone],
    queryFn: () => MonitorApi.getStatusByZone(zone),
  });
};

export const useEvents = (payload) => {
  return useQuery({
    queryKey: ['events', payload],
    queryFn: () => MonitorApi.getEvents(payload),
  });
};
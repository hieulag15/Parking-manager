import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { ParkingApi } from '~/api';

export const useGetStatus = (payload) => {
  return useQuery({
    queryKey: ['status', payload],
    queryFn: () => ParkingApi.getStatus(payload),
    keepPreviousData: true,
  });
};

export const useImportVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => ParkingApi.importVehicle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['status']);
      // socket.emit('parkingUpdated')
    },
  });
};

export const useExportVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => ParkingApi.exportVehicle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['status']);
      // socket.emit('parkingUpdated')
    },
  });
};
import { useQuery } from '@tanstack/react-query';
import VehicleApi from '~/api/Collections/VehicleApi';

export const useGetVehicleById = (id) => {
    return useQuery({
      queryKey: ['vehicle', id],
      queryFn: () => VehicleApi.getById(id),
      keepPreviousData: true,
    });
  };
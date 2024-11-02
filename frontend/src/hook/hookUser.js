import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserApi from '~/api/Collections/UserApi';

export const useGetUsers = (payload) => {
  return useQuery({
    queryKey: ['users', payload],
    queryFn: () => UserApi.get(payload),
  });
};

export const useGetDrivers = (payload) => {
  return useQuery({
    queryKey: ['drivers', payload],
    queryFn: () => UserApi.getDrivers(payload),
  });
};

export const useGetVehicles = (payload) => {
  return useQuery({
    queryKey: ['vehicles', payload],
    queryFn: () => UserApi.getVehicles(payload),
  });
};

export const useGetEmployee = (payload) => {
  return useQuery({
    queryKey: ['employee', payload],
    queryFn: () => UserApi.getEmployee(payload),
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => UserApi.add(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};

export const useAddDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => UserApi.addDriver(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['drivers']);
    },
  });
};

export const useAddManyUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => UserApi.addMany(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};

export const useEditUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ _id, payload }) => UserApi.edit(_id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};

export const useEditDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ _id, payload }) => UserApi.editDriver(_id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['drivers']);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (_id) => UserApi.delete(_id),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};

export const useDeleteManyUsers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => UserApi.deleteMany(ids),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};

export const useDeleteDriver = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (_id) => UserApi.deleteDriver(_id),
    onSuccess: () => {
      queryClient.invalidateQueries(['drivers']);
    },
  });
};

export const useDeleteManyDrivers = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (ids) => UserApi.deleteManyDriver(ids),
    onSuccess: () => {
      queryClient.invalidateQueries(['drivers']);
    },
  });
};

export const useChangePassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => UserApi.changePassword(payload),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
    },
  });
};
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {jwtDecode} from 'jwt-decode';
import { baseURL, LOGIN } from '../../components/Api/Api';

export const authApi = createApi({
    reducerPath: 'authApi', 
    baseQuery: fetchBaseQuery({ baseUrl: baseURL }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ username, password }) => ({
                url: LOGIN,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: { userName: username, password: password },
            }),
            transformResponse: (response) => {
                const token = response.accessToken;
                const decodedToken = jwtDecode(token);
                const role =
                    decodedToken[
                        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                    ];
                return { token, role };
            },
        }),
    }),
});

export const { useLoginMutation } = authApi;

'use client';

import React, { useState } from 'react';
import { useCreateUser } from '@/hooks/useCreateUser';

const CreateUserForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    sessionTimeOut: '',
    limitBytesIn: '',
    limitBytesOut: '',
  });

  const { mutate, isPending, isSuccess, isError, error } = useCreateUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutate({
      username: formData.username,
      password: formData.password,
      sessionTimeOut: formData.sessionTimeOut,
      limitBytesIn: formData.limitBytesIn || undefined,
      limitBytesOut: formData.limitBytesOut || undefined,
    });
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-xl rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        Créer un utilisateur PPPoE
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Nom d'utilisateur
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mot de passe
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="sessionTimeOut" className="block text-sm font-medium text-gray-700">
            Durée de session (ex: 1h, 1d)
          </label>
          <input
            id="sessionTimeOut"
            name="sessionTimeOut"
            type="text"
            value={formData.sessionTimeOut}
            onChange={handleChange}
            required
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="limitBytesIn" className="block text-sm font-medium text-gray-700">
            Limite entrante (en octets)
          </label>
          <input
            id="limitBytesIn"
            name="limitBytesIn"
            type="text"
            value={formData.limitBytesIn}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="limitBytesOut" className="block text-sm font-medium text-gray-700">
            Limite sortante (en octets)
          </label>
          <input
            id="limitBytesOut"
            name="limitBytesOut"
            type="text"
            value={formData.limitBytesOut}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          {isPending ? 'Création en cours...' : 'Créer l’utilisateur'}
        </button>

        {isSuccess && (
          <p className="text-green-600 text-center font-medium">
            ✅ Utilisateur créé avec succès !
          </p>
        )}
        {isError && (
          <p className="text-red-600 text-center font-medium">
            ❌ Erreur : {error.message}
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateUserForm;

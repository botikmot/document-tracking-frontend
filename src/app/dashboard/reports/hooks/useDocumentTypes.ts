'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/axios';

export interface DocumentType {
  id: string;
  name: string;
}

export function useDocumentTypes() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await api.get('/document-types');
      setDocumentTypes(data);
    }

    void load();
  }, []);

  return documentTypes;
}
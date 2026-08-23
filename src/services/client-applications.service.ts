import { clientApi } from '@/lib/client-api';

import type {
  ClientApplication,
  ClientApplicationTrackingResponse,
  CreateClientApplicationDto,
} from '@/types/client-application';

export const clientApplicationsService = {
  async findAll(
    token: string,
  ): Promise<ClientApplication[]> {
    return clientApi<ClientApplication[]>(
      '/client-applications',
      {
        method: 'GET',
        token,
      },
    );
  },

  async findOne(
    token: string,
    applicationId: string,
  ): Promise<ClientApplication> {
    return clientApi<ClientApplication>(
      `/client-applications/${applicationId}`,
      {
        method: 'GET',
        token,
      },
    );
  },

  async getTracking(
    token: string,
    applicationId: string,
  ): Promise<ClientApplicationTrackingResponse> {
    return clientApi<ClientApplicationTrackingResponse>(
      `/client-applications/${applicationId}/tracking`,
      {
        method: 'GET',
        token,
      },
    );
  },

  async create(
    token: string,
    dto: CreateClientApplicationDto,
  ): Promise<ClientApplication> {
    return clientApi<ClientApplication>(
      '/client-applications',
      {
        method: 'POST',
        token,

        body: JSON.stringify(dto),
      },
    );
  },

  async uploadRequirementFiles(
    token: string,
    applicationId: string,
    requirementId: string | null,
    files: File[],
  ) {
    const formData =
      new FormData();

    /*
    * Backend expects "files"
    * plural.
    */
    for (const file of files) {
      formData.append(
        'files',
        file,
      );
    }

    /*
    * Only send requirementId
    * when the upload belongs to
    * a specific requirement.
    */
    if (requirementId) {
      formData.append(
        'requirementId',
        requirementId,
      );
    }

    return clientApi(
      `/client-applications/${applicationId}/attachments`,
      {
        method: 'POST',

        token,

        body: formData,
      },
    );
  },

    async uploadLetterRequest(
      token: string,
      applicationId: string,
      file: File,
    ) {
      const formData =
        new FormData();

      /*
      * Backend expects "file"
      * singular.
      */
      formData.append(
        'file',
        file,
      );

      return clientApi(
        `/client-applications/${applicationId}/letter-request`,
        {
          method: 'POST',
          token,
          body: formData,
        },
      );
    },

    async submit(
      token: string,
      applicationId: string,
    ) {
      return clientApi(
        `/client-applications/${applicationId}/submit`,
        {
          method: 'POST',
          token,
        },
      );
    },

    async resubmit(
      token: string,
      applicationId: string,
    ) {
      return clientApi(
        `/client-applications/${applicationId}/resubmit`,
        {
          method: 'POST',
          token,
        },
      );
    },

  

};
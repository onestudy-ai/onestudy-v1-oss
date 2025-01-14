import { requireAuth } from '@clerk/nextjs/api'
import { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { z } from 'zod';

import { getOrganizationDomain, updateOrganizationDomain } from '@/server/data/organization';
import { canAccessGroup, createOrganizationGroup, deleteOrganizationGroup, getGroups } from '@/server/data/organization/group';
import { withExceptionFilter } from '@/server/middleware/withExceptionFilter';
import { withMethodsGuard } from '@/server/middleware/withMethodGuard';
import { withPipe } from '@/server/middleware/withPipe';
import { HttpStatusCode } from '@/server/utils/http';
import { throwBadRequestException, throwUnauthorizedException } from '@/server/utils/http-exceptions';
import logger from '@/server/utils/logger';
import { ClerkRequest } from '@/server/utils/types';

const Body = z.object({
	domain: z.string().optional(),
});

const SUPPORTED_HTTP_METHODS: HttpMethod[] = ['PUT', 'GET'];

export default function organizationDomainApi(
	req: ClerkRequest,
	res: NextApiResponse
) {
	const handler = withPipe(
		withMethodsGuard(SUPPORTED_HTTP_METHODS),
		requireAuth(organizationDomainHandler)
	);

	return withExceptionFilter(req, res)(handler);
}

const organizationDomainHandler = async (
	req: ClerkRequest,
	res: NextApiResponse
) => {
	const { method, query, auth } = req;

	if (!auth.userId || !auth.orgId) {
		return throwBadRequestException('Missing user/org');
	}

	switch (method) {
		case 'GET': {
			logger.info({
				orgId: auth.orgId,
			}, `Getting organization domain metadata`);

			try {
				const data = await getOrganizationDomain(auth.orgId);
				
				return res.send({
					success: true,
					data,
				});
			} catch (e: any) {
				throw new ApiError(HttpStatusCode.InternalServerError, e.message);
			}
		}
		case 'PUT': {
			const body = await Body.safeParse(req.body);

			if (!body.success) {
				return throwBadRequestException('Invalid request');
			}

			logger.info(
				{ name: body.data.domain },
				`Updating domain`
			);

			try {
				await updateOrganizationDomain(
					auth.orgId,
					body.data.domain
				);
			} catch (e: any) {
				throw new ApiError(HttpStatusCode.InternalServerError, e.message);
			}

			logger.info(
				{ name: body.data.domain },
				`Domain updated`
			);

			return res.send({ success: true });
		}
	}
}


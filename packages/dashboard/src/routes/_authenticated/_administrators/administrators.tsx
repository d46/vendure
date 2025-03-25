import { ListPage } from '@/framework/page/list-page.js';
import { Link, createFileRoute } from '@tanstack/react-router';
import { addCustomFields } from '@/framework/document-introspection/add-custom-fields.js';
import { administratorListDocument } from './administrators.graphql.js';
import { Trans } from '@lingui/react/macro';
import { DetailPageButton } from '@/components/shared/detail-page-button.js';
import { PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button.js';
import { PermissionGuard } from '@/components/shared/permission-guard.js';
import { PageActionBar } from '@/framework/layout-engine/page-layout.js';
import { Badge } from '@/components/ui/badge.js';
import { RoleCodeLabel } from '@/components/shared/role-code-label.js';
export const Route = createFileRoute('/_authenticated/_administrators/administrators')({
    component: AdministratorListPage,
    loader: () => ({ breadcrumb: () => <Trans>Administrators</Trans> }),
});

function AdministratorListPage() {
    return (
        <ListPage
            title="Administrators"
            listQuery={addCustomFields(administratorListDocument)}
            route={Route}
            onSearchTermChange={searchTerm => {
                return {
                    firstName: { contains: searchTerm },
                    lastName: { contains: searchTerm },
                    emailAddress: { contains: searchTerm },
                };
            }}
            additionalColumns={{
                name: {
                    header: 'Name',
                    cell: ({ row }) => (
                        <DetailPageButton
                            id={row.original.id}
                            label={`${row.original.firstName} ${row.original.lastName}`}
                        />
                    ),
                },
                roles: {
                    header: 'Roles',
                    cell: ({ row }) => {
                        return (
                            <div className="flex flex-wrap gap-2">
                                {row.original.user.roles.map(role => {
                                    return (
                                        <Badge variant="secondary" key={role.id}>
                                            <RoleCodeLabel code={role.code} />
                                        </Badge>
                                    );
                                })}
                            </div>
                        );
                    },
                },
            }}
            customizeColumns={{
                emailAddress: {
                    id: 'Identifier',
                    header: () => <Trans>Identifier</Trans>,
                    cell: ({ row }) => {
                        return <div>{row.original.emailAddress}</div>;
                    },
                },
            }}
            defaultVisibility={{
                emailAddress: true,
            }}
            defaultColumnOrder={['name', 'emailAddress', 'roles']}
        >
            <PageActionBar>
                <PermissionGuard requires={['CreateAdministrator']}>
                    <Button asChild>
                        <Link to="./new">
                            <PlusIcon />
                            New Administrator
                        </Link>
                    </Button>
                </PermissionGuard>
            </PageActionBar>
        </ListPage>
    );
}

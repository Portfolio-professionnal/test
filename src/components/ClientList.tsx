import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";
import { useTranslation } from "react-i18next";
import {
  PencilIcon,
  TrashIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

export function ClientList({ clients }: { clients: any[] }) {
  const { t } = useTranslation();
  const deleteClient = useMutation(api.clients.remove);

  const handleDelete = async (id: Id<"clients">) => {
    try {
      await deleteClient({ id });
      toast.success(t("messages.clientDeleted"));
    } catch (error) {
      toast.error(t("messages.deleteError"));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "prospect":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex flex-col">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">
                      {t("fields.name")}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t("fields.contact")}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t("fields.company")}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t("fields.status")}
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      {t("fields.tags")}
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4">
                      <span className="sr-only">{t("actions.edit")}</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {clients.map((client) => (
                    <tr key={client._id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                            <span className="text-white font-medium">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">{client.name}</div>
                            {client.website && (
                              <a href={client.website} className="text-gray-500 hover:text-indigo-600 flex items-center mt-1">
                                <GlobeAltIcon className="h-4 w-4 mr-1" />
                                {client.website.replace(/^https?:\/\//, '')}
                              </a>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center">
                            <EnvelopeIcon className="h-4 w-4 mr-1" />
                            <a href={`mailto:${client.email}`} className="hover:text-indigo-600">
                              {client.email}
                            </a>
                          </div>
                          {client.phone && (
                            <div className="flex items-center">
                              <PhoneIcon className="h-4 w-4 mr-1" />
                              <a href={`tel:${client.phone}`} className="hover:text-indigo-600">
                                {client.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {client.company && (
                          <div className="flex items-center">
                            <BuildingOfficeIcon className="h-4 w-4 mr-1" />
                            <span>{client.company}</span>
                          </div>
                        )}
                        {client.address && (
                          <div className="text-xs text-gray-400 mt-1">
                            {client.address}
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(client.status || 'active')}`}>
                          {t(`status.${client.status || 'active'}`)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {client.tags && client.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {client.tags.map((tag: string) => (
                              <span
                                key={tag}
                                className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800"
                              >
                                <TagIcon className="h-3 w-3 mr-1" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded-full hover:bg-indigo-50"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(client._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

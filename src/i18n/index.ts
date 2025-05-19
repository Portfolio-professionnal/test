import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      dashboard: {
        title: 'Tableau de bord',
        stats: {
          totalRevenue: 'Revenu total',
          pendingRevenue: 'Revenus en attente',
          pendingInvoices: 'Factures en attente',
          activeProjects: 'Projets actifs',
          totalClients: 'Clients totaux',
          monthlyHours: 'Heures ce mois',
          urgentTasks: 'Tâches urgentes',
          overdueInvoices: 'Factures en retard',
          totalProjects: 'Projets totaux'
        },
        charts: {
          monthlyRevenue: 'Revenu mensuel',
          projectStatus: 'État des projets',
          invoiceStatus: 'État des factures'
        }
      },
      navigation: {
        dashboard: 'Tableau de bord',
        clients: 'Clients',
        projects: 'Projets',
        invoices: 'Factures',
        tasks: 'Tâches',
        documents: 'Documents',
        expenses: 'Dépenses',
        reports: 'Rapports',
        settings: 'Paramètres'
      },
      actions: {
        add: 'Ajouter',
        edit: 'Modifier',
        delete: 'Supprimer',
        cancel: 'Annuler',
        save: 'Enregistrer',
        close: 'Fermer',
        newClient: 'Nouveau client',
        newProject: 'Nouveau projet',
        newInvoice: 'Nouvelle facture',
        newTask: 'Nouvelle tâche',
        newDocument: 'Nouveau document',
        newExpense: 'Nouvelle dépense'
      },
      fields: {
        name: 'Nom',
        email: 'Email',
        phone: 'Téléphone',
        company: 'Entreprise',
        website: 'Site web',
        address: 'Adresse',
        notes: 'Notes',
        tags: 'Tags',
        source: 'Source',
        status: 'Statut',
        contact: 'Contact',
        selectSource: 'Sélectionner une source'
      },
      sources: {
        referral: 'Recommandation',
        website: 'Site web',
        linkedin: 'LinkedIn',
        other: 'Autre'
      },
      status: {
        active: 'Actif',
        completed: 'Terminé',
        pending: 'En attente',
        paid: 'Payé',
        overdue: 'En retard',
        draft: 'Brouillon',
        inProgress: 'En cours',
        paused: 'En pause',
        cancelled: 'Annulé',
        prospect: 'Prospect',
        inactive: 'Inactif'
      },
      messages: {
        clientCreated: 'Client créé avec succès',
        clientDeleted: 'Client supprimé avec succès',
        createError: 'Erreur lors de la création',
        deleteError: 'Erreur lors de la suppression'
      },
      placeholders: {
        addTag: 'Ajouter un tag (Entrée pour valider)'
      }
    }
  },
  en: {
    translation: {
      dashboard: {
        title: 'Dashboard',
        stats: {
          totalRevenue: 'Total Revenue',
          pendingRevenue: 'Pending Revenue',
          pendingInvoices: 'Pending Invoices',
          activeProjects: 'Active Projects',
          totalClients: 'Total Clients',
          monthlyHours: 'Monthly Hours',
          urgentTasks: 'Urgent Tasks',
          overdueInvoices: 'Overdue Invoices',
          totalProjects: 'Total Projects'
        },
        charts: {
          monthlyRevenue: 'Monthly Revenue',
          projectStatus: 'Project Status',
          invoiceStatus: 'Invoice Status'
        }
      },
      navigation: {
        dashboard: 'Dashboard',
        clients: 'Clients',
        projects: 'Projects',
        invoices: 'Invoices',
        tasks: 'Tasks',
        documents: 'Documents',
        expenses: 'Expenses',
        reports: 'Reports',
        settings: 'Settings'
      },
      actions: {
        add: 'Add',
        edit: 'Edit',
        delete: 'Delete',
        cancel: 'Cancel',
        save: 'Save',
        close: 'Close',
        newClient: 'New Client',
        newProject: 'New Project',
        newInvoice: 'New Invoice',
        newTask: 'New Task',
        newDocument: 'New Document',
        newExpense: 'New Expense'
      },
      fields: {
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        company: 'Company',
        website: 'Website',
        address: 'Address',
        notes: 'Notes',
        tags: 'Tags',
        source: 'Source',
        status: 'Status',
        contact: 'Contact',
        selectSource: 'Select a source'
      },
      sources: {
        referral: 'Referral',
        website: 'Website',
        linkedin: 'LinkedIn',
        other: 'Other'
      },
      status: {
        active: 'Active',
        completed: 'Completed',
        pending: 'Pending',
        paid: 'Paid',
        overdue: 'Overdue',
        draft: 'Draft',
        inProgress: 'In Progress',
        paused: 'Paused',
        cancelled: 'Cancelled',
        prospect: 'Prospect',
        inactive: 'Inactive'
      },
      messages: {
        clientCreated: 'Client created successfully',
        clientDeleted: 'Client deleted successfully',
        createError: 'Error creating client',
        deleteError: 'Error deleting client'
      },
      placeholders: {
        addTag: 'Add a tag (Press Enter to add)'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

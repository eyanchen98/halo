import {
  ApiConsoleHaloRunV1alpha1PluginApi,
  ApiConsoleHaloRunV1alpha1PostApi,
  ApiConsoleHaloRunV1alpha1SinglePageApi,
  ApiConsoleHaloRunV1alpha1ThemeApi,
  ApiConsoleHaloRunV1alpha1UserApi,
  ApiConsoleHaloRunV1alpha1CommentApi,
  ApiConsoleHaloRunV1alpha1ReplyApi,
  ApiConsoleHaloRunV1alpha1StatsApi,
  ApiConsoleHaloRunV1alpha1AttachmentApi,
  ApiConsoleHaloRunV1alpha1IndicesApi,
  ApiConsoleHaloRunV1alpha1AuthProviderApi,
  ApiConsoleHaloRunV1alpha1SystemApi,
  ApiConsoleHaloRunV1alpha1NotifierApi,
  ApiNotificationHaloRunV1alpha1NotificationApi,
  ContentHaloRunV1alpha1CategoryApi,
  ContentHaloRunV1alpha1CommentApi,
  ContentHaloRunV1alpha1PostApi,
  ContentHaloRunV1alpha1ReplyApi,
  ContentHaloRunV1alpha1SnapshotApi,
  ContentHaloRunV1alpha1TagApi,
  ContentHaloRunV1alpha1SinglePageApi,
  PluginHaloRunV1alpha1PluginApi,
  PluginHaloRunV1alpha1ReverseProxyApi,
  StorageHaloRunV1alpha1AttachmentApi,
  StorageHaloRunV1alpha1GroupApi,
  StorageHaloRunV1alpha1PolicyApi,
  StorageHaloRunV1alpha1PolicyTemplateApi,
  ThemeHaloRunV1alpha1ThemeApi,
  V1alpha1ConfigMapApi,
  V1alpha1MenuApi,
  V1alpha1MenuItemApi,
  V1alpha1RoleApi,
  V1alpha1RoleBindingApi,
  V1alpha1SettingApi,
  V1alpha1UserApi,
  V1alpha1AnnotationSettingApi,
  V1alpha1CacheApi,
  LoginApi,
  AuthHaloRunV1alpha1AuthProviderApi,
  AuthHaloRunV1alpha1UserConnectionApi,
  ApiHaloRunV1alpha1UserApi,
  MigrationHaloRunV1alpha1BackupApi,
  ApiConsoleMigrationHaloRunV1alpha1MigrationApi,
  NotificationHaloRunV1alpha1NotifierDescriptorApi,
  ApiSecurityHaloRunV1alpha1PersonalAccessTokenApi,
  SecurityHaloRunV1alpha1PersonalAccessTokenApi,
  ApiSecurityHaloRunV1alpha1AuthenticationTwoFactorApi,
  UcApiContentHaloRunV1alpha1AttachmentApi,
  UcApiContentHaloRunV1alpha1PostApi,
  UcApiContentHaloRunV1alpha1SnapshotApi,
} from "@halo-dev/api-client";
import type { AxiosError, AxiosInstance } from "axios";
import axios from "axios";
import { useUserStore } from "@/stores/user";
import { Toast } from "@halo-dev/components";
import { i18n } from "@/locales";

const baseURL = import.meta.env.VITE_API_URL;
const modifyBaseURL = baseURL.replace(/\/[^\/]*$/, '');
const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});

export interface ProblemDetail {
  detail: string;
  instance: string;
  status: number;
  title: string;
  type?: string;
}

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ProblemDetail>) => {
    if (error.code === "ERR_CANCELED") {
      return Promise.reject(error);
    }

    if (/Network Error/.test(error.message)) {
      // @ts-ignore
      Toast.error(i18n.global.t("core.common.toast.network_error"));
      return Promise.reject(error);
    }

    const errorResponse = error.response;

    if (!errorResponse) {
      Toast.error(i18n.global.t("core.common.toast.network_error"));
      return Promise.reject(error);
    }

    // Don't show error toast
    // see https://github.com/halo-dev/halo/issues/2836
    if (errorResponse.config.mute) {
      return Promise.reject(error);
    }

    const { status } = errorResponse;
    const { title, detail } = errorResponse.data;

    if (status === 401) {
      const userStore = useUserStore();
      userStore.loginModalVisible = true;
      Toast.warning(i18n.global.t("core.common.toast.login_expired"));

      return Promise.reject(error);
    }

    if (title || detail) {
      Toast.error(detail || title);
      return Promise.reject(error);
    }

    Toast.error(i18n.global.t("core.common.toast.unknown_error"));

    return Promise.reject(error);
  }
);

axiosInstance.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

const apiClient = setupApiClient(axiosInstance);

function setupApiClient(axios: AxiosInstance) {
  return {
    extension: {
      configMap: new V1alpha1ConfigMapApi(undefined, modifyBaseURL, axios),
      roleBinding: new V1alpha1RoleBindingApi(undefined, modifyBaseURL, axios),
      role: new V1alpha1RoleApi(undefined, modifyBaseURL, axios),
      setting: new V1alpha1SettingApi(undefined, modifyBaseURL, axios),
      reverseProxy: new PluginHaloRunV1alpha1ReverseProxyApi(
        undefined,
        modifyBaseURL,
        axios
      ),
      plugin: new PluginHaloRunV1alpha1PluginApi(undefined, modifyBaseURL, axios),
      user: new V1alpha1UserApi(undefined, modifyBaseURL, axios),
      theme: new ThemeHaloRunV1alpha1ThemeApi(undefined, modifyBaseURL, axios),
      menu: new V1alpha1MenuApi(undefined, modifyBaseURL, axios),
      menuItem: new V1alpha1MenuItemApi(undefined, modifyBaseURL, axios),
      post: new ContentHaloRunV1alpha1PostApi(undefined, modifyBaseURL, axios),
      singlePage: new ContentHaloRunV1alpha1SinglePageApi(
        undefined,
        modifyBaseURL,
        axios
      ),
      category: new ContentHaloRunV1alpha1CategoryApi(
        undefined,
        modifyBaseURL,
        axios
      ),
      tag: new ContentHaloRunV1alpha1TagApi(undefined, modifyBaseURL, axios),
      snapshot: new ContentHaloRunV1alpha1SnapshotApi(
        undefined,
        modifyBaseURL,
        axios
      ),
      comment: new ContentHaloRunV1alpha1CommentApi(undefined, modifyBaseURL, axios),
      reply: new ContentHaloRunV1alpha1ReplyApi(undefined, modifyBaseURL, axios),
      storage: {
        group: new StorageHaloRunV1alpha1GroupApi(undefined, modifyBaseURL, axios),
        attachment: new StorageHaloRunV1alpha1AttachmentApi(
          undefined,
          modifyBaseURL,
          axios
        ),
        policy: new StorageHaloRunV1alpha1PolicyApi(undefined, modifyBaseURL, axios),
        policyTemplate: new StorageHaloRunV1alpha1PolicyTemplateApi(
          undefined,
          modifyBaseURL,
          axios
        ),
      },
      annotationSetting: new V1alpha1AnnotationSettingApi(
        undefined,
        modifyBaseURL,
        axios
      ),
      authProvider: new AuthHaloRunV1alpha1AuthProviderApi(
        undefined,
        modifyBaseURL,
        axios
      ),
      userConnection: new AuthHaloRunV1alpha1UserConnectionApi(
        undefined,
        modifyBaseURL,
        axios
      ),
      backup: new MigrationHaloRunV1alpha1BackupApi(undefined, modifyBaseURL, axios),
      notifierDescriptors: new NotificationHaloRunV1alpha1NotifierDescriptorApi(
        undefined,
        modifyBaseURL,
        axios
      ),
      pat: new SecurityHaloRunV1alpha1PersonalAccessTokenApi(
        undefined,
        modifyBaseURL,
        axios
      ),
    },
    // custom endpoints
    user: new ApiConsoleHaloRunV1alpha1UserApi(undefined, modifyBaseURL, axios),
    plugin: new ApiConsoleHaloRunV1alpha1PluginApi(undefined, modifyBaseURL, axios),
    theme: new ApiConsoleHaloRunV1alpha1ThemeApi(undefined, modifyBaseURL, axios),
    post: new ApiConsoleHaloRunV1alpha1PostApi(undefined, modifyBaseURL, axios),
    singlePage: new ApiConsoleHaloRunV1alpha1SinglePageApi(
      undefined,
      modifyBaseURL,
      axios
    ),
    comment: new ApiConsoleHaloRunV1alpha1CommentApi(undefined, modifyBaseURL, axios),
    reply: new ApiConsoleHaloRunV1alpha1ReplyApi(undefined, modifyBaseURL, axios),
    stats: new ApiConsoleHaloRunV1alpha1StatsApi(undefined, modifyBaseURL, axios),
    attachment: new ApiConsoleHaloRunV1alpha1AttachmentApi(
      undefined,
      modifyBaseURL,
      axios
    ),
    login: new LoginApi(undefined, modifyBaseURL, axios),
    indices: new ApiConsoleHaloRunV1alpha1IndicesApi(undefined, modifyBaseURL, axios),
    authProvider: new ApiConsoleHaloRunV1alpha1AuthProviderApi(
      undefined,
      modifyBaseURL,
      axios
    ),
    common: {
      user: new ApiHaloRunV1alpha1UserApi(undefined, modifyBaseURL, axios),
    },
    cache: new V1alpha1CacheApi(undefined, modifyBaseURL, axios),
    migration: new ApiConsoleMigrationHaloRunV1alpha1MigrationApi(
      undefined,
      modifyBaseURL,
      axios
    ),
    system: new ApiConsoleHaloRunV1alpha1SystemApi(undefined, modifyBaseURL, axios),
    notifier: new ApiConsoleHaloRunV1alpha1NotifierApi(
      undefined,
      modifyBaseURL,
      axios
    ),
    notification: new ApiNotificationHaloRunV1alpha1NotificationApi(
      undefined,
      modifyBaseURL,
      axios
    ),
    pat: new ApiSecurityHaloRunV1alpha1PersonalAccessTokenApi(
      undefined,
      modifyBaseURL,
      axios
    ),
    twoFactor: new ApiSecurityHaloRunV1alpha1AuthenticationTwoFactorApi(
      undefined,
      modifyBaseURL,
      axios
    ),
    uc: {
      post: new UcApiContentHaloRunV1alpha1PostApi(undefined, modifyBaseURL, axios),
      attachment: new UcApiContentHaloRunV1alpha1AttachmentApi(
        undefined,
        modifyBaseURL,
        axios
      ),
      snapshot: new UcApiContentHaloRunV1alpha1SnapshotApi(
        undefined,
        modifyBaseURL,
        axios
      ),
    },
  };
}

export { apiClient };

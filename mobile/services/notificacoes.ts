
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Define como as notificacoes aparecem no celular
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Configura e verifica as permissoes de notificacao
export async function configurarNotificacoes(): Promise<boolean> {
  try {
    // Cria o canal de alertas no Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(
        'alertas-urbanos',
        {
          name: 'Alertas Urbanos',
          importance: Notifications.AndroidImportance.HIGH,
          sound: 'default',
        }
      );
    }

    // Consulta as permissoes atuais
    const permissao =
      await Notifications.getPermissionsAsync();

    console.log('PERMISSAO ATUAL:', permissao);

    if (permissao.granted) {
      console.log('Notificacoes ja autorizadas');
      return true;
    }

    // Solicita permissao no iPhone
    const resultado =
      await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
        },
      });

    console.log('PERMISSAO NOTIFICACOES:', resultado);

    return resultado.granted;
  } catch (erro) {
    console.log('ERRO NAS PERMISSOES:', erro);
    return false;
  }
}

// Envia uma notificacao local de alerta critico
export async function notificarRiscoCritico(
  tipo: string,
  localizacao: string
): Promise<void> {
  try {
    const permissao =
      await Notifications.getPermissionsAsync();

    if (!permissao.granted) {
      console.log(
        'Notificacao nao enviada: permissao nao concedida'
      );
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🚨 UrbanGuard - Alerta Critico',
        body: `${tipo} registrado em ${localizacao}`,
        sound: 'default',
      },
      trigger: null,
    });

    console.log('NOTIFICACAO AGENDADA COM SUCESSO');
  } catch (erro) {
    console.log('ERRO AO ENVIAR NOTIFICACAO:', erro);
  }
}

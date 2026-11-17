
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import {
  buscarOcorrencias,
  cadastrarOcorrencia,
  Ocorrencia,
} from './services/api';

import {
  configurarNotificacoes,
  notificarRiscoCritico,
} from './services/notificacoes';

export default function App() {
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [conectado, setConectado] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState('');

  const alertasConhecidos = useRef<Set<number>>(new Set());
  const primeiraConsulta = useRef(true);

  // Campos do formulario
  const [tipo, setTipo] = useState('ALAGAMENTO');
  const [descricao, setDescricao] = useState('');
  const [localizacao, setLocalizacao] = useState('');
  const [gravidade, setGravidade] = useState('3');
  const [salvando, setSalvando] = useState(false);
  const [mensagemCadastro, setMensagemCadastro] = useState('');

  // Atualizacao automatica e notificacoes
  useEffect(() => {
    let ativo = true;
    let consultando = false;

    configurarNotificacoes();

    async function atualizarDados() {
      if (consultando) return;
      consultando = true;

      try {
        const dados = await buscarOcorrencias();

        if (!ativo) return;

        const novosCriticos = dados.filter(item => {
          const pontuacao = Math.round(
            ((item.gravidade / 5) * 0.8 +
              item.confiabilidade * 0.2) * 100
          );

          return (
            pontuacao >= 80 &&
            !alertasConhecidos.current.has(item.id)
          );
        });

        if (!primeiraConsulta.current) {
          for (const item of novosCriticos) {
            if (!ativo) return;

            await notificarRiscoCritico(
              item.tipo.replace(/_/g, ' '),
              item.localizacao
            );
          }
        }

        if (!ativo) return;

        dados.forEach(item => {
          alertasConhecidos.current.add(item.id);
        });

        primeiraConsulta.current = false;
        setOcorrencias(dados);
        setConectado(true);
        setUltimaAtualizacao(
          new Date().toLocaleTimeString('pt-BR')
        );
      } catch (erro) {
        if (ativo) {
          setConectado(false);
          console.log('Falha na conexao:', erro);
        }
      } finally {
        consultando = false;
        if (ativo) setCarregando(false);
      }
    }

    atualizarDados();

    const intervalo = setInterval(atualizarDados, 5000);

    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, []);

  // Cadastra uma ocorrencia pelo celular
  async function registrarOcorrencia() {
    if (!tipo.trim()) {
      setMensagemCadastro('Informe o tipo da ocorrencia.');
      return;
    }

    if (!descricao.trim() || !localizacao.trim()) {
      setMensagemCadastro('Preencha a descricao e a localizacao.');
      return;
    }

    const nivel = Number(gravidade);

    if (!Number.isInteger(nivel) || nivel < 1 || nivel > 5) {
      setMensagemCadastro('A gravidade deve ser de 1 a 5.');
      return;
    }

    setSalvando(true);
    setMensagemCadastro('');

    try {
      await cadastrarOcorrencia({
        tipo: tipo.trim().toUpperCase(),
        descricao: descricao.trim(),
        localizacao: localizacao.trim(),
        gravidade: nivel,
        origem: 'COMUNIDADE',
        confiabilidade: 0.7,
      });

      setDescricao('');
      setLocalizacao('');
      setMensagemCadastro('Ocorrencia cadastrada com sucesso!');
    } catch (erro) {
      setMensagemCadastro(
        'Erro ao cadastrar. Verifique a conexao.'
      );
    } finally {
      setSalvando(false);
    }
  }

  function calcularPrioridade(item: Ocorrencia) {
    return Math.round(
      ((item.gravidade / 5) * 0.8 +
        item.confiabilidade * 0.2) * 100
    );
  }

  function classificar(item: Ocorrencia) {
    const pontos = calcularPrioridade(item);

    if (pontos >= 80) {
      return { texto: 'CRÍTICO', cor: '#DC2626' };
    }

    if (pontos >= 60) {
      return { texto: 'ALTO', cor: '#F59E0B' };
    }

    if (pontos >= 40) {
      return { texto: 'MODERADO', cor: '#0284C7' };
    }

    return { texto: 'BAIXO', cor: '#16A34A' };
  }

  const alertasCriticos = ocorrencias.filter(
    item => calcularPrioridade(item) >= 80
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>◆ URBANGUARD</Text>

          <Text style={styles.subtitle}>
            Inteligência e Segurança Urbana
          </Text>

          <View style={styles.status}>
            <Text
              style={[
                styles.statusText,
                { color: conectado ? '#4ADE80' : '#FCA5A5' },
              ]}
            >
              {conectado
                ? '● Servidor conectado'
                : '● Servidor desconectado'}
            </Text>

            <Text style={styles.statusDetail}>
              {conectado
                ? `Atualizado às ${ultimaAtualizacao}`
                : 'Tentando reconectar automaticamente...'}
            </Text>
          </View>
        </View>

        {!conectado && !carregando && (
          <View style={styles.warning}>
            <Text style={styles.warningTitle}>
              ⚠️ Conexão indisponível
            </Text>

            <Text style={styles.warningText}>
              Não foi possível acessar a API.
              As últimas ocorrências recebidas
              continuam disponíveis.
              Tentaremos reconectar automaticamente.
            </Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>
          Visão Geral
        </Text>

        <View style={styles.cards}>
          <View style={styles.card}>
            <Text style={styles.cardLabel}>
              Ocorrências
            </Text>
            <Text style={styles.cardNumber}>
              {ocorrencias.length}
            </Text>
            <Text style={styles.cardDetail}>
              Registradas
            </Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>
              Alertas críticos
            </Text>
            <Text
              style={[
                styles.cardNumber,
                { color: '#DC2626' },
              ]}
            >
              {alertasCriticos}
            </Text>
            <Text style={styles.cardDetail}>
              Atenção imediata
            </Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>
            Monitoramento de riscos urbanos
          </Text>
          <Text style={styles.infoText}>
            Dados recebidos da API Spring Boot.
            Atualização automática a cada cinco segundos.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>
          Registrar Ocorrência
        </Text>

        <View style={styles.formulario}>
          <Text style={styles.formLabel}>
            Tipo de risco
          </Text>

          <TextInput
            style={styles.formInput}
            value={tipo}
            onChangeText={setTipo}
            placeholder="Ex.: ALAGAMENTO"
            autoCapitalize="characters"
          />

          <Text style={styles.formLabel}>
            Descrição
          </Text>

          <TextInput
            style={[styles.formInput, { height: 80 }]}
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descreva o problema encontrado"
            multiline
            textAlignVertical="top"
          />

          <Text style={styles.formLabel}>
            Localização
          </Text>

          <TextInput
            style={styles.formInput}
            value={localizacao}
            onChangeText={setLocalizacao}
            placeholder="Ex.: Santo André - SP"
          />

          <Text style={styles.formLabel}>
            Gravidade (1 a 5)
          </Text>

          <TextInput
            style={styles.formInput}
            value={gravidade}
            onChangeText={setGravidade}
            keyboardType="number-pad"
            maxLength={1}
          />

          <TouchableOpacity
            style={[
              styles.formButton,
              salvando && { opacity: 0.5 },
            ]}
            onPress={registrarOcorrencia}
            disabled={salvando}
            accessibilityRole="button"
            accessibilityLabel="Registrar ocorrência urbana"
          >
            <Text style={styles.formButtonText}>
              {salvando
                ? 'Salvando...'
                : 'Registrar Ocorrência'}
            </Text>
          </TouchableOpacity>

          {mensagemCadastro !== '' && (
            <Text style={styles.formMessage}>
              {mensagemCadastro}
            </Text>
          )}
        </View>

        <Text style={styles.sectionTitle}>
          Alertas e Ocorrências
        </Text>

        {carregando && (
          <ActivityIndicator
            size="large"
            color="#0284C7"
          />
        )}

        {!carregando && ocorrencias.length === 0 && (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyText}>
              Nenhuma ocorrência registrada.
            </Text>
          </View>
        )}

        {ocorrencias.map(item => {
          const prioridade = classificar(item);

          return (
            <View key={item.id} style={styles.eventCard}>
              <View style={styles.eventTop}>
                <Text style={styles.eventTitle}>
                  {item.tipo.replace(/_/g, ' ')}
                </Text>

                <View
                  style={[
                    styles.badge,
                    { backgroundColor: prioridade.cor },
                  ]}
                >
                  <Text style={styles.badgeText}>
                    {prioridade.texto}
                  </Text>
                </View>
              </View>

              <Text style={styles.location}>
                📍 {item.localizacao}
              </Text>

              <Text style={styles.description}>
                {item.descricao}
              </Text>

              <View style={styles.eventFooter}>
                <Text style={styles.score}>
                  Prioridade: {calcularPrioridade(item)}/100
                </Text>

                <Text style={styles.details}>
                  #{item.id}
                </Text>
              </View>

              <Text style={styles.source}>
                Origem: {item.origem} | Confiança:{' '}
                {Math.round(item.confiabilidade * 100)}%
              </Text>
            </View>
          );
        })}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            UrbanGuard | CitizenTech FIAP 2026
          </Text>
          <Text style={styles.footerNote}>
            Plataforma de monitoramento urbano
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  content: {
    paddingBottom: 35,
  },
  header: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 22,
    paddingTop: 45,
    paddingBottom: 30,
  },
  logo: {
    color: '#38BDF8',
    fontSize: 25,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  subtitle: {
    color: '#CBD5E1',
    marginTop: 6,
    fontSize: 14,
  },
  status: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  statusDetail: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 6,
  },
  warning: {
    backgroundColor: '#FEE2E2',
    margin: 20,
    padding: 16,
    borderRadius: 10,
  },
  warningTitle: {
    color: '#991B1B',
    fontSize: 15,
    fontWeight: 'bold',
  },
  warningText: {
    color: '#7F1D1D',
    fontSize: 12,
    marginTop: 8,
    lineHeight: 19,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#0F172A',
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 14,
  },
  cards: {
    flexDirection: 'row',
    marginHorizontal: 20,
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    elevation: 2,
  },
  cardLabel: {
    color: '#64748B',
    fontSize: 12,
  },
  cardNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0284C7',
    marginTop: 8,
  },
  cardDetail: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
  },
  infoBox: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    padding: 18,
  },
  infoTitle: {
    color: '#1E40AF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  infoText: {
    color: '#1E3A8A',
    fontSize: 13,
    marginTop: 8,
    lineHeight: 20,
  },
  formulario: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 12,
    elevation: 2,
  },
  formLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 7,
    marginTop: 12,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  formButton: {
    backgroundColor: '#0284C7',
    padding: 16,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 20,
  },
  formButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  formMessage: {
    color: '#0369A1',
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 18,
    borderRadius: 12,
    elevation: 2,
  },
  eventTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    flexShrink: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  location: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 14,
  },
  description: {
    color: '#334155',
    fontSize: 13,
    marginTop: 10,
    lineHeight: 19,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },
  score: {
    color: '#0284C7',
    fontWeight: 'bold',
    fontSize: 12,
  },
  details: {
    color: '#64748B',
    fontSize: 11,
  },
  source: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 12,
  },
  emptyBox: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 25,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 13,
  },
  footer: {
    alignItems: 'center',
    paddingTop: 25,
  },
  footerText: {
    color: '#64748B',
    fontSize: 12,
  },
  footerNote: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 5,
  },
});

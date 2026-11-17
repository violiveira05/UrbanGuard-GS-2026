
export const API_URL = 'http://192.168.15.81:8080';

export type Ocorrencia = {
  id: number;
  tipo: string;
  descricao: string;
  localizacao: string;
  gravidade: number;
  origem: string;
  confiabilidade: number;
  dataRegistro: string;
};

export async function buscarOcorrencias(): Promise<Ocorrencia[]> {
  const controller = new AbortController();

  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const resposta = await fetch(`${API_URL}/api/ocorrencias/alertas`, {
      signal: controller.signal,
    });

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    return await resposta.json();
  } finally {
    clearTimeout(timeout);
  }
}

export type NovaOcorrencia = {
  tipo: string;
  descricao: string;
  localizacao: string;
  gravidade: number;
  origem: string;
  confiabilidade: number;
};

export async function cadastrarOcorrencia(
  dados: NovaOcorrencia
): Promise<Ocorrencia> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  try {
    const resposta = await fetch(
      `${API_URL}/api/ocorrencias`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
        signal: controller.signal,
      }
    );

    if (!resposta.ok) {
      throw new Error(
        `Erro ao cadastrar ocorrência: ${resposta.status}`
      );
    }

    return await resposta.json();
  } finally {
    clearTimeout(timeout);
  }
}

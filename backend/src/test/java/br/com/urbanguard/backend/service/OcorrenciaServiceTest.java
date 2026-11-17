
package br.com.urbanguard.backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertSame;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import br.com.urbanguard.backend.model.Ocorrencia;
import br.com.urbanguard.backend.repository.OcorrenciaRepository;

class OcorrenciaServiceTest {

    private OcorrenciaRepository repository;
    private OcorrenciaService service;

    @BeforeEach
    void preparar() {
        repository = mock(OcorrenciaRepository.class);
        service = new OcorrenciaService(repository);
    }

    private Ocorrencia criarOcorrencia(
            int gravidade,
            double confiabilidade
    ) {
        Ocorrencia ocorrencia = new Ocorrencia();

        ocorrencia.setTipo("ALAGAMENTO");
        ocorrencia.setDescricao("Ocorrencia de teste");
        ocorrencia.setLocalizacao("Santo Andre - SP");
        ocorrencia.setGravidade(gravidade);
        ocorrencia.setOrigem("COMUNIDADE");
        ocorrencia.setConfiabilidade(confiabilidade);

        return ocorrencia;
    }

    @Test
    void deveClassificarRiscoCritico() {
        Ocorrencia ocorrencia = criarOcorrencia(5, 0.9);

        assertEquals(98, service.calcularPrioridade(ocorrencia));
        assertEquals("CRITICO", service.classificarPrioridade(ocorrencia));
    }

    @Test
    void deveClassificarRiscoAlto() {
        Ocorrencia ocorrencia = criarOcorrencia(4, 0.7);

        assertEquals(78, service.calcularPrioridade(ocorrencia));
        assertEquals("ALTO", service.classificarPrioridade(ocorrencia));
    }

    @Test
    void deveClassificarRiscoModerado() {
        Ocorrencia ocorrencia = criarOcorrencia(2, 0.7);

        assertEquals(46, service.calcularPrioridade(ocorrencia));
        assertEquals("MODERADO", service.classificarPrioridade(ocorrencia));
    }

    @Test
    void deveClassificarRiscoBaixo() {
        Ocorrencia ocorrencia = criarOcorrencia(1, 0.5);

        assertEquals(26, service.calcularPrioridade(ocorrencia));
        assertEquals("BAIXO", service.classificarPrioridade(ocorrencia));
    }

    @Test
    void deveCalcularPontuacaoMaxima() {
        Ocorrencia ocorrencia = criarOcorrencia(5, 1.0);

        assertEquals(100, service.calcularPrioridade(ocorrencia));
    }

    @Test
    void deveSalvarOcorrencia() {
        Ocorrencia ocorrencia = criarOcorrencia(3, 0.7);

        when(repository.save(ocorrencia)).thenReturn(ocorrencia);

        Ocorrencia resultado = service.salvar(ocorrencia);

        assertSame(ocorrencia, resultado);
        verify(repository).save(ocorrencia);
    }
}

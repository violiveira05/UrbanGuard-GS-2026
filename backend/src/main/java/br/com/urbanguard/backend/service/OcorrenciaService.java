
package br.com.urbanguard.backend.service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import br.com.urbanguard.backend.model.Ocorrencia;
import br.com.urbanguard.backend.repository.OcorrenciaRepository;

@Service
public class OcorrenciaService {

    private final OcorrenciaRepository repository;

    public OcorrenciaService(OcorrenciaRepository repository) {
        this.repository = repository;
    }

    // Cadastra uma nova ocorrência urbana
    public Ocorrencia salvar(Ocorrencia ocorrencia) {
        return repository.save(ocorrencia);
    }

    // Lista todas as ocorrências
    public List<Ocorrencia> listarTodas() {
        return repository.findAll();
    }

    // Busca uma ocorrência pelo identificador
    public Optional<Ocorrencia> buscarPorId(Long id) {
        return repository.findById(id);
    }

    // Filtra as ocorrências pelo tipo de risco
    public List<Ocorrencia> buscarPorTipo(String tipo) {
        return repository.findByTipoIgnoreCase(tipo);
    }

    // Calcula prioridade de 0 a 100
    public int calcularPrioridade(Ocorrencia ocorrencia) {
        double gravidade = ocorrencia.getGravidade() / 5.0;
        double confiabilidade = ocorrencia.getConfiabilidade();

        double pontuacao =
                (gravidade * 0.8 + confiabilidade * 0.2) * 100;

        return (int) Math.round(pontuacao);
    }

    // Classifica a prioridade do alerta
    public String classificarPrioridade(Ocorrencia ocorrencia) {
        int prioridade = calcularPrioridade(ocorrencia);

        if (prioridade >= 80) {
            return "CRITICO";
        } else if (prioridade >= 60) {
            return "ALTO";
        } else if (prioridade >= 40) {
            return "MODERADO";
        }

        return "BAIXO";
    }

    // Lista os alertas ordenados por prioridade
    public List<Ocorrencia> listarPorPrioridade() {
        return repository.findAll()
                .stream()
                .sorted(Comparator.comparingInt(
                        this::calcularPrioridade).reversed())
                .toList();
    }

    // Exclui uma ocorrência existente
    public void excluir(Long id) {
        repository.deleteById(id);
    }
}

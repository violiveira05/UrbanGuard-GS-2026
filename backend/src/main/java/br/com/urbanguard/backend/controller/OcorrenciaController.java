
package br.com.urbanguard.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.urbanguard.backend.model.Ocorrencia;
import br.com.urbanguard.backend.service.OcorrenciaService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/ocorrencias")
public class OcorrenciaController {

    private final OcorrenciaService service;

    public OcorrenciaController(OcorrenciaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Ocorrencia> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ocorrencia> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/tipo/{tipo}")
    public List<Ocorrencia> buscarPorTipo(@PathVariable String tipo) {
        return service.buscarPorTipo(tipo);
    }

    @GetMapping("/alertas")
    public List<Ocorrencia> listarAlertas() {
        return service.listarPorPrioridade();
    }

    @GetMapping("/{id}/prioridade")
    public ResponseEntity<Map<String, Object>> prioridade(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ocorrencia -> ResponseEntity.ok(
                        Map.<String, Object>of(
                                "id", ocorrencia.getId(),
                                "pontuacao", service.calcularPrioridade(ocorrencia),
                                "classificacao", service.classificarPrioridade(ocorrencia)
                        )))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Ocorrencia> cadastrar(
            @Valid @RequestBody Ocorrencia ocorrencia) {
        ocorrencia.setId(null);
        ocorrencia.setDataRegistro(null);
        Ocorrencia salva = service.salvar(ocorrencia);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        if (service.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
}
    

package br.com.urbanguard.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.urbanguard.backend.model.Ocorrencia;


public interface OcorrenciaRepository extends JpaRepository<Ocorrencia, Long> {

    List<Ocorrencia> findByTipoIgnoreCase(String tipo);

    List<Ocorrencia> findByGravidadeGreaterThanEqual(Integer gravidade);

    List<Ocorrencia> findAllByOrderByGravidadeDescDataRegistroDesc();
}

package co.edu.local.gestionIcfes.servicesImpl;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import co.edu.local.gestionIcfes.model.Estudiante;
import co.edu.local.gestionIcfes.model.ResultadoSimulacro;
import co.edu.local.gestionIcfes.model.Simulacro;
import co.edu.local.gestionIcfes.repository.EstudianteRepositorio;
import co.edu.local.gestionIcfes.repository.ResultadoSimulacroRepositorio;
import co.edu.local.gestionIcfes.repository.SimulacroRepositorio;
import co.edu.local.gestionIcfes.services.LogService;
import co.edu.local.gestionIcfes.services.ResultadoSimulacroService;
import jakarta.transaction.Transactional;

/**
 * Implementación de {@link co.edu.local.gestionIcfes.services.ResultadoSimulacroService}.
 * <p>
 * Calcula el {@code puntajeGlobal} como la suma de los cinco puntajes por área antes
 * de persistir el resultado. Solo acepta archivos de tipo {@code application/pdf}.
 * </p>
 */
@Service
@Transactional
public class ResultadoSimulacroServiceImpl implements ResultadoSimulacroService {

    @Autowired
    private LogService logService;

    private final EstudianteRepositorio estudianteRepo;
    private final SimulacroRepositorio simulacroRepo;
    private final ResultadoSimulacroRepositorio resultadoRepo;

    public ResultadoSimulacroServiceImpl(EstudianteRepositorio estudianteRepo,
                                         SimulacroRepositorio simulacroRepo,
                                         ResultadoSimulacroRepositorio resultadoRepo) {
        this.estudianteRepo = estudianteRepo;
        this.simulacroRepo = simulacroRepo;
        this.resultadoRepo = resultadoRepo;
    }

    @Override
    public ResultadoSimulacro subirResultado(String documentoIdentidad, Long simulacroId, MultipartFile archivo,
            Integer puntajeSociales, Integer puntajeNaturales, Integer puntajeMatematicas,
            Integer puntajelecturaCritica, Integer puntajeIngles, Integer puestoSalon) {

        Estudiante estudiante = estudianteRepo.findById(documentoIdentidad)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));

        Simulacro simulacro = simulacroRepo.findById(simulacroId)
                .orElseThrow(() -> new RuntimeException("Simulacro no encontrado"));

        if (!"application/pdf".equals(archivo.getContentType())) {
            throw new RuntimeException("Solo se permiten archivos PDF");
        }

        try {
            byte[] bytes = archivo.getBytes();
            if (bytes.length < 4
                    || bytes[0] != '%' || bytes[1] != 'P' || bytes[2] != 'D' || bytes[3] != 'F') {
                throw new RuntimeException("El archivo no es un PDF válido");
            }

            int global = puntajeSociales + puntajeNaturales + puntajeMatematicas
                    + puntajelecturaCritica + puntajeIngles;

            ResultadoSimulacro resultado = new ResultadoSimulacro();
            resultado.setNombreArchivo(archivo.getOriginalFilename());
            resultado.setTipoArchivo(archivo.getContentType());
            resultado.setDatos(bytes);
            resultado.setPuntajeSociales(puntajeSociales);
            resultado.setPuntajeNaturales(puntajeNaturales);
            resultado.setPuntajeMatematicas(puntajeMatematicas);
            resultado.setPuntajelecturaCritica(puntajelecturaCritica);
            resultado.setPuntajeIngles(puntajeIngles);
            resultado.setPuntajeGlobal(global);
            resultado.setPuestoSalon(puestoSalon);
            resultado.setEstudiante(estudiante);
            resultado.setSimulacro(simulacro);
            logService.registrarLog("simulacro", "Resultado simulacro subido");
            return resultadoRepo.save(resultado);
        } catch (IOException e) {
            throw new RuntimeException("Error al leer el archivo PDF", e);
        }
    }

    @Override
    public List<ResultadoSimulacro> listarResultadosPorEstudiante(String documentoIdentidad) {
        Estudiante estudiante = estudianteRepo.findById(documentoIdentidad)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado"));
        return estudiante.getResultados();
    }
}

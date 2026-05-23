package co.edu.local.gestionIcfes.servicesImpl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import co.edu.local.gestionIcfes.model.Institucion;
import co.edu.local.gestionIcfes.model.MaterialEstudio;
import co.edu.local.gestionIcfes.repository.MaterialEstudioRepositorio;
import co.edu.local.gestionIcfes.services.InstitucionService;
import co.edu.local.gestionIcfes.services.MaterialEstudioServices;

/**
 * Implementación de {@link co.edu.local.gestionIcfes.services.MaterialEstudioServices}.
 * <p>
 * Al subir un material, asigna automáticamente la fecha de subida ({@code LocalDate.now()}).
 * Los métodos de lectura están anotados con {@code @Transactional(readOnly = true)} para
 * mantener la sesión de Hibernate activa mientras se accede al campo {@code archivo} (BYTEA).
 * </p>
 */
@Service
@Transactional
public class MaterialEstudioServicesImpl implements MaterialEstudioServices {

    private static final Set<String> TIPOS_PERMITIDOS = Set.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "image/jpeg",
            "image/png"
    );

    @Autowired
    private MaterialEstudioRepositorio materialRepositorio;

    @Autowired
    private InstitucionService institucionService;

    @Override
    public MaterialEstudio subirMaterial(MultipartFile archivo, String titulo, String descripcion,
                                          Integer semana, Long institucionId) {
        String contentType = archivo.getContentType();
        if (contentType == null || !TIPOS_PERMITIDOS.contains(contentType)) {
            throw new RuntimeException("Tipo de archivo no permitido. Se aceptan: PDF, Word, JPG, PNG");
        }

        Institucion institucion = institucionService.buscarPorId(institucionId);

        try {
            byte[] bytes = archivo.getBytes();
            if ("application/pdf".equals(contentType)
                    && (bytes.length < 4
                        || bytes[0] != '%' || bytes[1] != 'P' || bytes[2] != 'D' || bytes[3] != 'F')) {
                throw new RuntimeException("El archivo no es un PDF válido");
            }

            MaterialEstudio material = new MaterialEstudio();
            material.setTitulo(titulo);
            material.setDescripcion(descripcion);
            material.setSemana(semana);
            material.setFechaSubida(LocalDate.now());
            material.setNombreArchivo(archivo.getOriginalFilename());
            material.setTipoArchivo(contentType);
            material.setArchivo(bytes);
            material.setInstitucion(institucion);
            return materialRepositorio.save(material);
        } catch (IOException e) {
            throw new RuntimeException("Error al leer el archivo", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<MaterialEstudio> listarPorInstitucion(Long institucionId) {
        return materialRepositorio.findByInstitucionIdOrderBySemanaDesc(institucionId);
    }

    @Override
    @Transactional(readOnly = true)
    public MaterialEstudio descargarMaterial(Long id) {
        return materialRepositorio.findById(id)
                .orElseThrow(() -> new RuntimeException("Material no encontrado"));
    }

    @Override
    public void eliminarMaterial(Long id) {
        materialRepositorio.deleteById(id);
    }
}

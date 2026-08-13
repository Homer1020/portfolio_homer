// src/pages/api/seed.ts
import type { APIRoute } from 'astro';
import { db } from '../../config/firebase';
import projectsData from '../../data/projects.json'; // Ajusta la ruta a tu data.json
import { doc, setDoc, collection, serverTimestamp } from 'firebase/firestore';

export const GET: APIRoute = async () => {
  if (import.meta.env.PROD) {
    return new Response(
      JSON.stringify({ success: false, error: 'Ruta deshabilitada en producción.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const projects = projectsData;
    const results: string[] = [];

    // Referencia a la colección 'projects'
    const projectsCollection = collection(db, 'projects');

    for (const project of projects) {
      const docId = project.slug;

      // Crear la referencia al documento usando su slug como ID
      const docRef = doc(projectsCollection, docId);

      // Guardar/Actualizar el documento
      await setDoc(
        docRef,
        {
          title: project.title,
          slug: project.slug,
          mockup: project.mockup,
          image: project.image,
          stacks: project.stacks ?? [],
          description: project.description ?? '',
          url: project.url ?? null,
          github: project.github ?? null,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      results.push(`Migrado: ${project.title} (${docId})`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '¡Migración completada exitosamente!',
        migratedProjects: results,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error durante el seeding:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Error desconocido al poblar la base de datos',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
// src/pages/api/seed-stacks.ts
import type { APIRoute } from 'astro';
import { db } from '../../config/firebase';
import stacksData from '../../data/stacks.json';
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';

export const GET: APIRoute = async () => {
  if (import.meta.env.PROD) {
    return new Response(
      JSON.stringify({ success: false, error: 'Ruta deshabilitada en producción.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const stacksCollection = collection(db, 'stacks');
    const stacksSnap = await getDocs(stacksCollection);

    if (!stacksSnap.empty) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'La colección "stacks" ya tiene datos, no se migró nada para evitar duplicados.',
          totalExisting: stacksSnap.size,
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const results: string[] = [];

    for (const stack of stacksData) {
      await addDoc(stacksCollection, {
        name: stack.name,
        icon: stack.icon,
        darkIcon: stack.darkIcon ?? '',
        order: stack.order ?? 0,
        draft: stack.draft ?? false,
        createdAt: serverTimestamp(),
      });

      results.push(`Migrado: ${stack.name}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '¡Migración de stacks completada exitosamente!',
        migratedStacks: results,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    console.error('Error durante el seeding de stacks:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Error desconocido al poblar la base de datos de stacks',
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

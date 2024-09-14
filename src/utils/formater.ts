import type { TestimonialInterface } from "../types";
import type { DocumentSnapshot } from "firebase/firestore";

export const formatTestimonials = (qs: any): TestimonialInterface[] => {
  const testimonials: TestimonialInterface[] = [];
  const baseUrl = "https://firebasestorage.googleapis.com/v0/b/portfolio-74159.appspot.com/o/";

  qs.forEach((doc: DocumentSnapshot) => {
    const avatarPath = doc.get('avatar'); // Ruta parcial o nombre del archivo

    testimonials.push({
      id: doc.id,
      role: doc.get('role'),
      name: doc.get('name'),
      testimonial: doc.get('testimonial'),
      avatar: `${baseUrl}${encodeURIComponent(avatarPath)}?alt=media` // Concatenar la URL base con la ruta del avatar
    });
  });

  return testimonials;
}
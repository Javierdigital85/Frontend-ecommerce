export interface ICarousel {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICarouselForm {
  title: string;
  subtitle: string;
  image: string;
  order: number;
  active: boolean;
}

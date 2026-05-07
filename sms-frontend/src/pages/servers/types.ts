export type ServerDevice = {
  id: string;
  name: string;
  model: string;
  biosVersiya: string;
  dasturVersiyasi: string;
  umumiyXabarlar: number;
  status: 'online' | 'offline' | 'noreply';
};

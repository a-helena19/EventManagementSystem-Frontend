export type Event = {
  id: number;
  name: string;
  description?: string;

  minPrice?: number;

  status: "ACTIVE" | "CANCELLED";
  cancellationReason?: string;
  cancelDate?: string;

  category: string;

  requirements: Requirement[];
  equipment: EventEquipment[];
  additionalPackages: AdditionalPackage[];

  organizerId?: number;
  organizer?: Organizer;

  feedback?: EventFeedback[];

  imageIds?: number[];

  hikingRouteId?: string;
};


export type Requirement = {
  id: number;
  description: string;
};

export type EventEquipment = {
  id: number;
  name: string;
  rentable: boolean;
};

export type AdditionalPackage = {
  id: number;
  title: string;
  description: string;
  price: number;
  quantity: number;

};

export type Organizer = {
  id: number;
  name: string;
  contactEmail: string;
  phone: string;
};

export type EventFeedback = {
  rating: number;
  comment?: string;
};

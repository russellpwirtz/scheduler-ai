export type AvailabilityWindow = {
  start: string;
  end: string;
};

export type AvailabilityData = {
  availability: AvailabilityWindow[];
}; 
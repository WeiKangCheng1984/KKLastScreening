'use client';

import { useState } from 'react';

export interface ActiveItemDetail {
  id: string;
  name: string;
  image?: string;
  svgImage?: string;
  description?: string;
}

export function useInventoryDetail() {
  const [activeItemDetail, setActiveItemDetail] = useState<ActiveItemDetail | null>(null);
  return { activeItemDetail, setActiveItemDetail };
}


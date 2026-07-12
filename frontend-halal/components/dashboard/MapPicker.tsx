"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { configureLeafletIcon, defaultIcon } from "@/lib/leaflet";

interface MapPickerProps {
  onLocationSelect: (latitude: number, longitude: number, alamat: string) => void;
  defaultLat?: number;
  defaultLng?: number;
  defaultAlamat?: string;
}

type MapSearchResult = {
  provider: "google" | "nominatim";
  id: string;
  description: string;
  lat?: number;
  lon?: number;
  placeId?: string;
  display_name?: string;
  raw?: any;
};

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function MapPicker({
  onLocationSelect,
  defaultLat = 1.1291,
  defaultLng = 104.7313,
  defaultAlamat = "",
}: MapPickerProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [address, setAddress] = useState(defaultAlamat);
  const [lat, setLat] = useState(defaultLat);
  const [lng, setLng] = useState(defaultLng);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<MapSearchResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [googleAvailable, setGoogleAvailable] = useState(false);
  const searchDebounce = useRef<number | null>(null);
  const googleAutocompleteService = useRef<any>(null);
  const googlePlacesService = useRef<any>(null);

  useEffect(() => {
    configureLeafletIcon();
  }, []);

  useEffect(() => {
    if (!showMap || !mapContainer.current || map.current) return;

    map.current = L.map(mapContainer.current).setView([defaultLat, defaultLng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map.current);

    marker.current = L.marker([defaultLat, defaultLng], { icon: defaultIcon })
      .addTo(map.current)
      .bindPopup("Lokasi Anda");

    map.current.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;

      if (marker.current) {
        marker.current.setLatLng([lat, lng]);
      } else {
        marker.current = L.marker([lat, lng], { icon: defaultIcon })
          .addTo(map.current!)
          .bindPopup("Lokasi Anda");
      }

      setLat(lat);
      setLng(lng);
      getAddressFromCoordinates(lat, lng);
    });

    if (marker.current) {
      map.current.setView([marker.current.getLatLng().lat, marker.current.getLatLng().lng], 13);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [showMap, defaultLat, defaultLng]);

  useEffect(() => {
    if (!googleMapsApiKey || !showMap) return;
    if ((window as any).google?.maps?.places) {
      initializeGooglePlaces();
      return;
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src*="maps.googleapis.com/maps/api/js"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", initializeGooglePlaces);
      return () => {
        existingScript.removeEventListener("load", initializeGooglePlaces);
      };
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initializeGooglePlaces;
    script.onerror = () => {
      setSearchError("Google Maps API gagal dimuat. Periksa kunci API atau koneksi.");
      setGoogleAvailable(false);
    };

    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", initializeGooglePlaces);
    };
  }, [showMap]);

  const initializeGooglePlaces = () => {
    const google = (window as any).google;
    if (!google?.maps?.places) {
      setGoogleAvailable(false);
      return;
    }

    googleAutocompleteService.current ??= new google.maps.places.AutocompleteService();
    googlePlacesService.current ??= new google.maps.places.PlacesService(
      document.createElement("div")
    );
    setGoogleAvailable(true);
  };

  const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const data = await response.json();
      const addr = data.address?.road || data.display_name || "Lokasi dipilih";
      setAddress(addr);
    } catch (error) {
      console.error("Error getting address:", error);
      setAddress(`Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
    }
  };

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      setSearchError("");
      setSearchLoading(false);
      return;
    }

    if (searchDebounce.current) window.clearTimeout(searchDebounce.current);
    searchDebounce.current = window.setTimeout(async () => {
      setSearchLoading(true);
      setSearchError("");

      const allResults: MapSearchResult[] = [];
      let hasError = false;

      // Parallel search dari kedua provider
      const googlePromise = new Promise<void>((resolve) => {
        if (!googleMapsApiKey || !googleAvailable || !googleAutocompleteService.current) {
          resolve();
          return;
        }

        googleAutocompleteService.current.getPlacePredictions(
          {
            input: searchQuery,
            componentRestrictions: { country: "id" },
            types: ["geocode"],
          },
          (predictions: any[], status: string) => {
            if (status === "OK" && predictions && predictions.length > 0) {
              allResults.push(
                ...predictions.map((prediction) => ({
                  provider: "google" as const,
                  id: prediction.place_id,
                  placeId: prediction.place_id,
                  description: prediction.description,
                  raw: prediction,
                }))
              );
            }
            resolve();
          }
        );
      });

      const nominatimPromise = fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=10&countrycodes=id&q=${encodeURIComponent(
          searchQuery
        )}`
      )
        .then((resp) => {
          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
          return resp.json();
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            allResults.push(
              ...data.map((item: any) => ({
                provider: "nominatim" as const,
                id: item.place_id?.toString() || item.osm_id?.toString() || item.display_name,
                description: item.display_name,
                lat: parseFloat(item.lat),
                lon: parseFloat(item.lon),
                display_name: item.display_name,
                raw: item,
              }))
            );
          }
        })
        .catch((err) => {
          console.error("Nominatim search error:", err);
          hasError = true;
        });

      try {
        await Promise.all([googlePromise, nominatimPromise]);

        // Remove duplicates berdasarkan description
        const uniqueResults = Array.from(
          new Map(allResults.map((item) => [item.description, item])).values()
        );

        setSearchResults(uniqueResults);

        if (uniqueResults.length === 0) {
          setSearchError("Tidak ditemukan. Coba kata kunci lain.");
        } else if (hasError) {
          setSearchError(""); // Suppress error jika ada hasil dari provider lain
        }
      } catch (err) {
        console.error("Search error:", err);
        if (allResults.length === 0) {
          setSearchError("Gagal mencari lokasi. Coba lagi.");
        } else {
          setSearchResults(allResults);
        }
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => {
      if (searchDebounce.current) window.clearTimeout(searchDebounce.current);
    };
  }, [searchQuery, googleAvailable]);

  const handleSelectSearchResult = async (item: MapSearchResult) => {
    setSearchLoading(true);

    try {
      if (item.provider === "google" && item.placeId) {
        if (!googlePlacesService.current) {
          setSearchError("Google Places belum siap. Menggunakan data alternatif...");
          // Fallback to reverse geocoding jika Google Places gagal
          setSearchResults([]);
          setSearchQuery("");
          setSearchLoading(false);
          return;
        }

        googlePlacesService.current.getDetails(
          { placeId: item.placeId, fields: ["geometry", "formatted_address", "name"] },
          (place: any, status: string) => {
            if (status !== "OK" || !place?.geometry?.location) {
              setSearchError("Gagal mengambil detail lokasi. Coba lagi.");
              setSearchLoading(false);
              return;
            }

            const latNum = place.geometry.location.lat();
            const lonNum = place.geometry.location.lng();
            const description = place.formatted_address || place.name || item.description;

            updateMapWithLocation(latNum, lonNum, description);
            setSearchLoading(false);
          }
        );
      } else if (item.provider === "nominatim" && item.lat !== undefined && item.lon !== undefined) {
        // Nominatim sudah punya koordinat
        updateMapWithLocation(item.lat, item.lon, item.display_name || item.description);
        setSearchLoading(false);
      } else if (item.provider === "google" && item.raw?.geometry?.location) {
        // Fallback jika data sudah tersedia di raw
        const latNum = item.raw.geometry.location.lat();
        const lonNum = item.raw.geometry.location.lng();
        updateMapWithLocation(latNum, lonNum, item.description);
        setSearchLoading(false);
      }
    } catch (error) {
      console.error("Error selecting search result:", error);
      setSearchError("Gagal memproses lokasi yang dipilih.");
      setSearchLoading(false);
    }
  };

  const updateMapWithLocation = (latNum: number, lonNum: number, description: string) => {
    if (map.current) {
      map.current.setView([latNum, lonNum], 16);
    }

    if (marker.current) {
      marker.current.setLatLng([latNum, lonNum]);
    } else if (map.current) {
      marker.current = L.marker([latNum, lonNum], { icon: defaultIcon })
        .addTo(map.current)
        .bindPopup("Lokasi Anda");
    }

    setLat(latNum);
    setLng(lonNum);
    setAddress(description);
    setSearchResults([]);
    setSearchQuery("");
    setSearchError("");
  };

  const handleConfirmLocation = () => {
    onLocationSelect(lat, lng, address);
    setShowMap(false);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-slate-300 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-700">Lokasi Terpilih:</p>
        <p className="mt-1 text-sm text-slate-600">
          {address || "Belum ada lokasi terpilih"}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
        </p>
      </div>

      <button
        type="button"
        onClick={() => setShowMap(!showMap)}
        className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        {showMap ? "Sembunyikan Peta" : "Pilih Lokasi di Peta"}
      </button>

      {showMap && (
        <div className="space-y-3">
          <div className="space-y-2">
            <input
              type="search"
              placeholder="Cari nama tempat atau alamat..."
              className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            {searchLoading && (
              <p className="text-sm text-slate-500">Mencari lokasi dari Google Maps & database lokal...</p>
            )}
            {!searchLoading && searchError && (
              <p className="text-sm text-red-500">{searchError}</p>
            )}
            {!searchLoading && !searchError && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <p className="text-sm text-slate-500">Tidak ditemukan. Coba kata kunci lain atau klik di peta.</p>
            )}
            {!searchLoading && searchResults.length > 0 && (
              <p className="text-xs text-slate-400">Ditemukan {searchResults.length} hasil</p>
            )}

            {searchResults.length > 0 && (
              <div className="max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white shadow-sm">
                {searchResults.map((item, idx) => (
                  <button
                    key={`${item.provider}-${item.id}-${idx}`}
                    onClick={() => handleSelectSearchResult(item)}
                    className="w-full text-left px-4 py-3 hover:bg-emerald-50 border-b border-slate-100 last:border-b-0 transition flex items-start gap-2"
                  >
                    <span className="text-slate-400 mt-0.5">📍</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{item.description}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.provider === "google" ? "Google Maps" : "Database Lokal"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div
            ref={mapContainer}
            className="h-96 rounded-2xl border border-slate-300 overflow-hidden"
          />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleConfirmLocation}
              className="flex-1 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Konfirmasi Lokasi
            </button>
            <button
              type="button"
              onClick={() => setShowMap(false)}
              className="flex-1 rounded-2xl bg-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-400"
            >
              Batal
            </button>
          </div>

          <p className="text-xs text-slate-500">
            💡 Klik di peta untuk memilih lokasi destinasi Anda
          </p>
        </div>
      )}
    </div>
  );
}

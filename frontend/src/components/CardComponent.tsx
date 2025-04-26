import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import cardService from "../services/cardService";

interface CardFormData {
  imageLink: string;
  name: string;
  description: string;
}

const CardComponent = () => {
  const queryClient = useQueryClient();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [formData, setFormData] = useState<CardFormData>({
    imageLink: "",
    name: "",
    description: "",
  });

  // Fetch all cards
  const {
    data: cards,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cards"],
    queryFn: cardService.getAllCards,
  });

  // Create card mutation
  const createMutation = useMutation({
    mutationFn: cardService.createCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      setFormData({ imageLink: "", name: "", description: "" });
    },
  });

  // Update card mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: CardFormData }) =>
      cardService.updateCard(id, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
      setSelectedCard(null);
      setFormData({ imageLink: "", name: "", description: "" });
    },
  });

  // Delete card mutation
  const deleteMutation = useMutation({
    mutationFn: cardService.deleteCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCard) {
      updateMutation.mutate({ id: selectedCard, formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (card: any) => {
    setSelectedCard(card.id);
    setFormData({
      imageLink: card.imageLink,
      name: card.name,
      description: card.description,
    });
  };

  console.log(cards);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading cards</div>;

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block">Image Link</label>
          <input
            type="text"
            value={formData.imageLink}
            onChange={(e) =>
              setFormData({ ...formData, imageLink: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {selectedCard ? "Update Card" : "Create Card"}
        </button>
        {selectedCard && (
          <button
            type="button"
            onClick={() => {
              setSelectedCard(null);
              setFormData({ imageLink: "", name: "", description: "" });
            }}
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards?.map((card) => (
          <div key={card.id} className="border p-4 rounded">
            <img
              src={card.imageLink}
              alt={card.name}
              className="w-full h-48 object-cover mb-2"
            />
            <h3 className="text-xl font-bold">{card.name}</h3>
            <p className="text-gray-600">{card.description}</p>
            <div className="mt-4 space-x-2">
              <button
                onClick={() => handleEdit(card)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMutation.mutate(card.id)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardComponent;

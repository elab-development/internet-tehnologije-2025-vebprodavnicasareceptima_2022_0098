<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'total_amount' => (float) $this->total_amount,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}

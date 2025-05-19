import type { Conversation, KnowledgeSource } from "./types"

export function generateSampleData() {
  const conversations: Conversation[] = [
    {
      id: "conv-1",
      customer: {
        id: "cust-1",
        name: "Luis Davison",
        email: "luis.davison@example.com",
      },
      messages: [
        {
          id: "msg-1",
          content:
            "I bought a product from your store in November as a Christmas gift for a member of my family. However, it turns out they have something very similar already. I was hoping you'd be able to refund me, as it is un-opened.",
          sender: "customer",
          timestamp: "2023-05-18T10:30:00Z",
        },
        {
          id: "msg-2",
          content: "Let me just look into this for you, Luis.",
          sender: "agent",
          timestamp: "2023-05-18T10:32:00Z",
        },
      ],
      lastMessage: "Let me just look into this for you, Luis.",
      updatedAt: "2023-05-18T10:32:00Z",
      category: "orders",
      unread: 0,
    },
    {
      id: "conv-2",
      customer: {
        id: "cust-2",
        name: "Sarah Miller",
        email: "sarah.miller@example.com",
      },
      messages: [
        {
          id: "msg-3",
          content:
            "Hello, I'm having trouble with my recent order #45678. The package was supposed to arrive yesterday but I haven't received it yet.",
          sender: "customer",
          timestamp: "2023-05-17T14:20:00Z",
        },
      ],
      lastMessage:
        "Hello, I'm having trouble with my recent order #45678. The package was supposed to arrive yesterday but I haven't received it yet.",
      updatedAt: "2023-05-17T14:20:00Z",
      category: "orders",
      unread: 1,
    },
    {
      id: "conv-3",
      customer: {
        id: "cust-3",
        name: "John Smith",
        email: "john.smith@example.com",
      },
      messages: [
        {
          id: "msg-4",
          content: "Hi there, I need help with setting up my new device. The instructions aren't very clear.",
          sender: "customer",
          timestamp: "2023-05-16T09:15:00Z",
        },
      ],
      lastMessage: "Hi there, I need help with setting up my new device. The instructions aren't very clear.",
      updatedAt: "2023-05-16T09:15:00Z",
      category: "support",
      unread: 1,
    },
    {
      id: "conv-4",
      customer: {
        id: "cust-4",
        name: "Emma Johnson",
        email: "emma.johnson@example.com",
      },
      messages: [
        {
          id: "msg-5",
          content: "I'd like to cancel my subscription. How do I do that?",
          sender: "customer",
          timestamp: "2023-05-15T16:45:00Z",
        },
      ],
      lastMessage: "I'd like to cancel my subscription. How do I do that?",
      updatedAt: "2023-05-15T16:45:00Z",
      category: "support",
      unread: 1,
    },
    {
      id: "conv-5",
      customer: {
        id: "cust-5",
        name: "Michael Brown",
        email: "michael.brown@example.com",
      },
      messages: [
        {
          id: "msg-6",
          content: "Do you offer international shipping? I'm interested in ordering but I live overseas.",
          sender: "customer",
          timestamp: "2023-05-14T11:30:00Z",
        },
      ],
      lastMessage: "Do you offer international shipping? I'm interested in ordering but I live overseas.",
      updatedAt: "2023-05-14T11:30:00Z",
      category: "general",
      unread: 1,
    },
  ]

  const knowledgeSources: KnowledgeSource[] = [
    {
      id: "kb-1",
      title: "Getting a refund",
      excerpt: "Learn about our refund policy and how to request a refund for your purchase.",
      content:
        "We offer refunds for products returned within 60 days of purchase. The item must be in its original condition and packaging. To request a refund, please contact our customer support team with your order number and reason for return.",
      category: "returns",
    },
    {
      id: "kb-2",
      title: "Refund for an order placed by mistake",
      excerpt: "Information about getting a refund for an accidental purchase.",
      content:
        "If you placed an order by mistake, please contact us within 24 hours of purchase. We can cancel the order if it hasn't shipped yet. If the order has already shipped, you'll need to return the item following our standard return procedure.",
      category: "returns",
    },
    {
      id: "kb-3",
      title: "Refund for an unwanted gift",
      excerpt: "How to return and get a refund for unwanted gifts.",
      content:
        "Unwanted gifts can be returned for store credit or exchange within 90 days of purchase. You'll need the gift receipt or order number. If you don't have either, we may still be able to process the return based on the payment method used for the purchase.",
      category: "returns",
    },
    {
      id: "kb-4",
      title: "Shipping Policy",
      excerpt: "Information about our shipping options, timeframes, and costs.",
      content:
        "We offer standard shipping (3-5 business days), expedited shipping (2 business days), and overnight shipping. International shipping is available to select countries with delivery times ranging from 7-21 business days depending on the destination.",
      category: "shipping",
    },
    {
      id: "kb-5",
      title: "Product Warranty",
      excerpt: "Details about our product warranty coverage and claims process.",
      content:
        "All our products come with a standard 1-year warranty covering manufacturing defects. Premium products have extended warranties of up to 3 years. To make a warranty claim, please contact our support team with your order details and a description of the issue.",
      category: "warranty",
    },
  ]

  return { conversations, knowledgeSources }
}

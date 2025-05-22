"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <input
        type="text"
        placeholder="Nama Lengkap"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-2"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-2"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-2"
      />
    </>
  );
} 
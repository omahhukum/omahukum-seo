  <Input
    type="text"
    placeholder="Nama Lengkap"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="w-full"
  />
  <Input
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className="w-full"
  />
  <Input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className="w-full"
  /> 
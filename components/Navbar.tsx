"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNewspaper, faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="nav-container">
      <Link href="/" className="nav-logo">
        <FontAwesomeIcon
          icon={faNewspaper}
          style={{ color: "#274da0", height: "30px" }}
        />
        <span className="nav-title">Nugget News</span>
      </Link>
      <div>
        <input
          type="search"
          className="nav-search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Link
          href={{
            pathname: `/article/search`,
            query: { href: searchQuery },
          }}
          passHref
        >
          <FontAwesomeIcon icon={faSearch} className="nav-search-icon" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;

"use client"

import { getBooks, type bookData } from "@/app/lib/database";

import PageContent from "@/app/components/BookGrid";
import NewBookForm from "@/app/components/form/NewBookForm"
import SettingsModal from "@/app/components/SettingsModal"
import { useState } from "react";

export default function HomeContents(
    {books} : {books:bookData[]}
) {

    const [settingsOpen, setSettingsOpen] = useState(false);


    return (
        <>
          <NewBookForm></NewBookForm>
          <SettingsModal modalOpen={settingsOpen} setModalOpen={setSettingsOpen}></SettingsModal>
          <div className="navbar">
            <div className="user" onClick={() => {setSettingsOpen(true)}}>U</div>
          </div>
          <div className="spacer"></div>
          <PageContent books={books as bookData[]}></PageContent>
      </>
    )
}
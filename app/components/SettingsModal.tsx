"use client"

export default function SettingsModal(
    {modalOpen, setModalOpen}:
    {
        modalOpen: boolean,
        setModalOpen: (modalOpen: boolean) => void
    }) {
        return (
            <>
                {modalOpen && (
                    <>
                        <div className="backdrop" onClick={() => {setModalOpen(false)}}></div>
                        <div className="modal settings">
                            <h1>Settings</h1>
                        </div>
                    </>
                )}
            </>
        );
}
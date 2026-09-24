import { AppButton } from "@/components/AppButton";
import { AppModal } from "@/components/AppModal";
import { StatusBanner } from "@/components/StatusBanner";

/** Which half of "sign, then save" is running — drives the button's message. */
export type SignAndSaveStep = "idle" | "signing" | "saving";

const BUTTON_TEXT: Record<SignAndSaveStep, string> = {
  idle: "Sign and save",
  signing: "Waiting for your signature...",
  saving: "Saving area...",
};

export type SignAndSaveAreaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSignAndSave: () => void;
  step: SignAndSaveStep;
  signError?: string | null;
  saveError?: string | null;
};

export function SignAndSaveAreaModal({
  isOpen,
  onClose,
  onSignAndSave,
  step,
  signError,
  saveError,
}: SignAndSaveAreaModalProps) {
  const isBusy = step !== "idle";

  return (
    <AppModal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign and save this area"
      description="Your wallet will ask you to sign these details. The area is saved only once the signature succeeds."
      actions={
        <>
          <AppButton
            text={BUTTON_TEXT[step]}
            icon={isBusy ? undefined : "wallet-outline"}
            onPress={onSignAndSave}
            disabled={isBusy}
          />
          <AppButton
            text="Cancel"
            theme="secondary"
            outline
            onPress={onClose}
            disabled={isBusy}
          />
        </>
      }
    >
      {signError && (
        <StatusBanner
          theme="error"
          title="Signature failed"
          description={signError}
        />
      )}

      {saveError && (
        <StatusBanner
          theme="error"
          title="Something went wrong"
          description={saveError}
        />
      )}
    </AppModal>
  );
}

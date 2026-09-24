import { Box } from "@/components/ui/box";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";

export type AppModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Extra body content under the description (e.g. error banners). */
  children?: React.ReactNode;
  /** Buttons, stacked full-width in the order given. */
  actions: React.ReactNode;
};

export function AppModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  actions,
}: AppModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Text bold size="lg" className="text-foreground">
            {title}
          </Text>
        </ModalHeader>

        <ModalBody>
          <Box className="gap-3">
            {description && (
              <Text size="sm" className="text-muted-foreground">
                {description}
              </Text>
            )}
            {children}
          </Box>
        </ModalBody>

        <ModalFooter className="flex-col items-stretch">{actions}</ModalFooter>
      </ModalContent>
    </Modal>
  );
}

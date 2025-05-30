import { useState, useRef, useEffect, ChangeEvent, KeyboardEvent} from 'react';


interface ConfirmationCodeInputProps {
    length?: number;
    onComplete?: (code: string) => void;

}

const ConfirmationCodeInput = ({length = 6, onComplete}:ConfirmationCodeInputProps) => {
    const [code, setCode] = useState(Array(length).fill(''));
    const inputRefs = useRef<HTMLInputElement[]>([]);

    // Configurar las referencias iniciales
    useEffect(() => {
        inputRefs.current = inputRefs.current.slice(0, length);
    }, [length]);

    const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
        const rawValue = e.target.value.toUpperCase(); // Convertir a mayúsculas

        // Permitir solo caracteres A-Z y 0-9
        if (!/^[A-Z0-9]*$/.test(rawValue)) return;

        // Obtener solo el último carácter si se pega más de uno
        const digit = rawValue.slice(-1);

        // Actualizar el estado
        const newCode = [...code];
        newCode[index] = digit;
        setCode(newCode);

        // Si se ingresó un dígito y no es el último input, mover al siguiente
        if (digit && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }

        // Verificar si se completó el código
        if (newCode.every(val => val !== '') && onComplete) {
            onComplete(newCode.join(''));
        }
    };


    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        // Manejar la tecla backspace
        if (e.key === 'Backspace') {
            if (code[index] === '' && index > 0) {
                // Si el input actual está vacío y no es el primero, mover al anterior
                inputRefs.current[index - 1].focus();
            }
        }
        // Manejar las flechas izquierda y derecha
        else if (e.key === 'ArrowLeft' && index > 0) {
            inputRefs.current[index - 1].focus();
        }
        else if (e.key === 'ArrowRight' && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handlePaste = (e: {
        preventDefault: () => void;
        clipboardData: { getData: (arg0: string) => string };
    }) => {
        e.preventDefault();

        // Convertir a mayúsculas, filtrar solo caracteres A-Z y 0-9, y limitar longitud
        const pasteData = e.clipboardData
            .getData('text')
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, '')
            .slice(0, length);

        if (pasteData) {
            const newCode = [...code];

            for (let i = 0; i < pasteData.length; i++) {
                if (i < length) {
                    newCode[i] = pasteData[i];
                }
            }

            setCode(newCode);

            // Mover el foco al siguiente campo vacío o al último si todos están llenos
            const nextEmptyIndex = newCode.findIndex(val => val === '');
            const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
            inputRefs.current[focusIndex].focus();

            // Verificar si se completó el código
            if (newCode.every(val => val !== '') && onComplete) {
                onComplete(newCode.join(''));
            }
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center">
            {Array.from({ length }, (_, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="form-control text-center mx-1"
                    style={{
                        width: '3rem',
                        height: '3rem',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                    }}
                    value={code[index]}
                    onChange={(e) => handleChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    ref={el => {
                        if (el) {
                            inputRefs.current[index] = el
                        } }}
                />
            ))}
        </div>
    );
};
export default ConfirmationCodeInput;